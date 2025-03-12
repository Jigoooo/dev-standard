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
    router: Router.MY_PROFILE,
    fullRouterPath: `${Router.MAIN}/${Router.MY_PROFILE}`,
    display: true,
  },
];

function isNonIndexRoute(route: RouteObject): route is Exclude<RouteObject, { index: true }> {
  return !('index' in route);
}

function makeGroupMenus(responseMenus: RMenu[]): TMenu[] {
  const mainGroups = new Map<number, RMenu[]>();
  responseMenus.forEach((menu) => {
    if (!mainGroups.has(menu.MAIN_CD)) {
      mainGroups.set(menu.MAIN_CD, []);
    }
    mainGroups.get(menu.MAIN_CD)!.push(menu);
  });

  const mainMenus: TMenu[] = [];

  for (const [mainCd, menus] of mainGroups.entries()) {
    const subGroups = new Map<number, RMenu[]>();
    let mainMenu: TMenu | null = null;

    menus.forEach((menu) => {
      if (!subGroups.has(menu.SUB1_CD)) {
        subGroups.set(menu.SUB1_CD, []);
      }

      if (menu.SUB2_CD === 0) {
        const routerPath = menu.MENU_ID as Router;

        mainMenu = {
          menuIndex: mainCd,
          name: menu.MENU_TITLE,
          icon: routerMappedIcon[routerPath],
          display: menu.DISPLAY_YN === 'Y',
          router: routerPath,
          fullRouterPath: menu.MENU_LINK,
        };
      } else {
        subGroups.get(menu.SUB1_CD)!.push(menu);
      }
    });

    let subMenus: TMenu[] = [];

    for (const [, subMenusArr] of subGroups.entries()) {
      subMenusArr.sort((a, b) => a.ORDER_BY - b.ORDER_BY);

      subMenus = subMenusArr.map((menu) => {
        const routerPath = menu.MENU_ID as Router;

        return {
          menuIndex: Number(`${menu.MAIN_CD}${menu.SUB1_CD}${menu.SUB2_CD}`),
          name: menu.MENU_TITLE,
          icon: routerMappedIcon[routerPath],
          router: routerPath,
          fullRouterPath: menu.MENU_LINK,
          display: menu.DISPLAY_YN === 'Y',
        };
      });
    }

    if (mainMenu) {
      (mainMenu as TMenu).children = subMenus.length > 0 ? subMenus : undefined;
      mainMenus.push(mainMenu);
    }
  }

  // const flatMenus = mainMenus.flatMap((menu) => menu.children || []);
  return mainMenus;
}

function generateRoutesFromMenus(menus: TMenu[]): RouteObject[] {
  return menus.map((menu) => {
    const Component = routerComponentMap[menu.router];
    return {
      path: menu.router,
      element: menu.display && Component ? <Component /> : null,
      children: menu.children ? generateRoutesFromMenus(menu.children) : undefined,
    };
  });
}

export function RouterMenuContextWrapper({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState(defaultRoutes);
  const [menus, setMenus] = useState(defaultMenus);

  const sidebarMainMenus = menus.filter((menu) => menu.router !== Router.MY_PROFILE);
  const myProfileMenu = defaultMenus[0];

  const updateRouteChildren = (parentPath: string, newChildren: RouteObject[], merge?: boolean) => {
    setRoutes((prevState) => {
      return prevState.map((route) => {
        if (route.path === parentPath && isNonIndexRoute(route)) {
          let updatedChildren: RouteObject[];
          if (merge && route.children) {
            const merged = route.children.map((child) => {
              const matchingNewChild = newChildren.find((nc) => nc.path === child.path);
              return matchingNewChild ? matchingNewChild : child;
            });
            const newEntries = newChildren.filter(
              (nc) => !route.children?.some((child) => child.path === nc.path),
            );
            updatedChildren = [...merged, ...newEntries];
          } else {
            updatedChildren = newChildren;
          }
          return { ...route, children: updatedChildren };
        }
        return route;
      });
    });
  };
  const updateMainRouteChildren = (responseMenus: RMenu[]) => {
    const groupMenus = makeGroupMenus(responseMenus);

    const newChildren: RouteObject[] = generateRoutesFromMenus(groupMenus);

    setMenus((prevState) => {
      const updatedMenus = prevState.map((menu) => {
        const matching = groupMenus.find((m) => m.router === menu.router);
        return matching ? matching : menu;
      });

      const newEntries = groupMenus.filter(
        (m) => !prevState.some((menu) => menu.router === m.router),
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
        if (menu.router === router) {
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
