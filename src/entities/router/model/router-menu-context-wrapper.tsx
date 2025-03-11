import { ReactNode, useState } from 'react';
import { RouteObject } from 'react-router-dom';

import { Router, TMenu } from './router-type.ts';
import { routerComponentMap, routerMappedIcon } from './router-map.tsx';
import { RouterMenuContext } from '@/entities/router';
import { RMenu } from './router-type.ts';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';
import { RouteErrorPage } from '@/shared/components';

const defaultRoutes: RouteObject[] = [
  {
    path: Router.SIGN_IN,
    element: <SignIn />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: <Main />,
    children: [
      {
        path: Router.MY_PROFILE,
        element: <MyProfile />,
      },
    ],
  },
];

const defaultMenus: TMenu[] = [
  {
    menuIndex: 9999,
    name: '내정보',
    icon: routerMappedIcon[Router.MY_PROFILE],
    routerPath: Router.MY_PROFILE,
    fullRouterPath: `${Router.MAIN}/${Router.MY_PROFILE}`,
    display: true,
  },
];

function isNonIndexRoute(route: RouteObject): route is Exclude<RouteObject, { index: true }> {
  return !('index' in route);
}

function groupMenus(responseMenus: RMenu[]): TMenu[] {
  // 1. mainCd별로 그룹화
  const mainGroups = new Map<number, RMenu[]>();
  responseMenus.forEach((menu) => {
    if (!mainGroups.has(menu.MAIN_CD)) {
      mainGroups.set(menu.MAIN_CD, []);
    }
    mainGroups.get(menu.MAIN_CD)!.push(menu);
  });

  const mainMenus: TMenu[] = [];

  // 2. 각 mainCd 그룹 내에서 sub1Cd로 그룹화
  for (const [mainCd, menus] of mainGroups.entries()) {
    const subGroups = new Map<number, RMenu[]>();
    menus.forEach((menu) => {
      if (!subGroups.has(menu.SUB1_CD)) {
        subGroups.set(menu.SUB1_CD, []);
      }
      subGroups.get(menu.SUB1_CD)!.push(menu);
    });

    const subMenus: TMenu[] = [];

    // 3. 각 sub1Cd 그룹 내에서 sub2Cd 순으로 정렬하고 TMenu로 변환
    for (const [sub1Cd, subMenusArr] of subGroups.entries()) {
      // 정렬 (ORDER_BY 또는 SUB2_CD 기준)
      subMenusArr.sort((a, b) => a.SUB2_CD - b.SUB2_CD);

      // 3depth 항목들 생성 (leaf items)
      const leafMenus: TMenu[] = subMenusArr.map((menu) => {
        const menuId = menu.MENU_ID as Router;

        return {
          menuIndex: Number(`${menu.MAIN_CD}${menu.SUB1_CD}${menu.SUB2_CD}`),
          name: menu.MENU_TITLE,
          icon: routerMappedIcon[menuId] || undefined,
          routerPath: menuId,
          fullRouterPath: menu.MENU_LINK,
          display: menu.DISPLAY_YN === 'Y',
        };
      });

      // sub1Cd 그룹 헤더 – 여기서는 그룹 라벨을 따로 지정하지 않으면 빈 문자열 처리
      // subMenus.push({
      //   menuIndex: Number(`${mainCd}${sub1Cd}`),
      //   name: '', // 필요에 따라 그룹명을 추가 (예: 공통된 prefix 등)
      //   display: true,
      //   children: leafMenus,
      // });
    }

    // mainCd 그룹 헤더 – 마찬가지로 그룹 라벨이 없다면 빈 문자열 처리
    // mainMenus.push({
    //   menuIndex: mainCd,
    //   name: '', // 필요시 main 그룹 라벨 지정
    //   display: true,
    //   children: subMenus,
    // });
  }

  // 만약 최상위(leaf가 아닌) 항목이 없다면, flatten해서 TMenu 배열로 반환할 수도 있음
  // 예를 들어, 모든 메뉴가 3단계 구조라면 mainMenus.flatMap(menu => menu.children || [])
  return mainMenus;
}

export function RouterMenuContextWrapper({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState(defaultRoutes);
  const [menus, setMenus] = useState(defaultMenus);

  const sidebarMainMenus = menus.filter((menu) => menu.routerPath !== Router.MY_PROFILE);
  const myProfileMenu = defaultMenus[0];

  const updateRouteChildren = (parentPath: string, newChildren: RouteObject[], merge?: boolean) => {
    setRoutes((prevState) => {
      return prevState.map((route) => {
        if (route.path === parentPath && isNonIndexRoute(route)) {
          const updatedChildren =
            merge && route.children ? [...route.children, ...newChildren] : newChildren;
          return { ...route, children: updatedChildren };
        }

        return route;
      });
    });
  };
  const updateMainRouteChildren = (responseMenus: RMenu[]) => {
    const newMenus: TMenu[] = responseMenus.map((responseMenu) => {
      const menuIndex = Number(responseMenu.MAIN_CD + responseMenu.SUB1_CD + responseMenu.SUB2_CD);
      const menuId = responseMenu.MENU_ID as Router;
      const display = responseMenu.DISPLAY_YN === 'Y';

      return {
        menuIndex,
        name: responseMenu.MENU_TITLE,
        icon: routerMappedIcon[menuId],
        routerPath: menuId,
        fullRouterPath: responseMenu.MENU_LINK,
        display,
      };
    });

    const newChildren = newMenus.map((menu) => {
      const Component = routerComponentMap[menu.routerPath]!;
      return {
        path: menu.routerPath,
        element: menu.display ? <Component /> : null,
      };
    });

    setMenus((prevState) => {
      const updatedMenus = prevState.map((menu) => {
        const matching = newMenus.find((m) => m.routerPath === menu.routerPath);
        return matching ? matching : menu;
      });

      const newEntries = newMenus.filter(
        (m) => !prevState.some((menu) => menu.routerPath === m.routerPath),
      );
      return [...updatedMenus, ...newEntries];
    });

    updateRouteChildren(Router.MAIN, newChildren, true);
  };
  const updateRoutes = (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => {
    setRoutes((prevState) => updater(prevState));
  };

  const updateRouteName = (router: Router, newName: string) => {
    setMenus((prevState) => {
      return prevState.map((menu) => {
        if (menu.routerPath === router) {
          return {
            ...menu,
            name: newName,
          };
        }

        return menu;
      });
    });
  };

  return (
    <RouterMenuContext
      value={{
        routes,
        menus,
        sidebarMainMenus,
        myProfileMenu,
        updateRouteChildren,
        updateMainRouteChildren,
        updateRoutes,
        updateRouteName,
      }}
    >
      {children}
    </RouterMenuContext>
  );
}
