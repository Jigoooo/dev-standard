import { ReactNode, useState } from 'react';
import { RouteObject } from 'react-router-dom';
import { IconType } from 'react-icons';

import { RxComponent1 } from 'react-icons/rx';
import { GoTable } from 'react-icons/go';
import { FaRegFile } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { IoPersonCircleOutline } from 'react-icons/io5';

import { Router, TMenu } from './router-type.ts';
import { componentMap, RouterMenuContext } from '@/entities/router';
import { SignIn } from '@/pages/sign-in';
import { RouteErrorPage } from '@/shared/components';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';
import { RMenu } from './router-type.ts';

const defaultRoutes: RouteObject[] = [
  {
    path: Router.SIGN_IN,
    element: <SignIn />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: <Main />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: Router.MY_PROFILE,
        element: <MyProfile />,
      },
    ],
  },
];

export function RouterMenuContextWrapper({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState(defaultRoutes);

  const routerMenus = useRouterMenus();

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

      return {
        menuIndex,
        name: responseMenu.MENU_TITLE,
        icon: routerMappedIconName[menuId].icon,
        router: menuId,
        fullRouterPath: responseMenu.MENU_LINK,
      };
    });
    const newChildren = newMenus.map((menu) => {
      const Component = componentMap[menu.router]!;
      return {
        path: menu.fullRouterPath,
        element: <Component />,
      };
    });

    updateRouteChildren(Router.MAIN, newChildren, true);

    routerMenus.setMenus(newMenus);
  };
  const updateRoutes = (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => {
    setRoutes((prevState) => updater(prevState));
  };

  const updateRouteName = (fullRouterPath: string, newName: string) => {
    setRoutes((prevState) => {
      return prevState.map((route) => {
        if (route.path === fullRouterPath) {
          return { ...route, name: newName };
        }
        return route;
      });
    });
  };

  return (
    <RouterMenuContext
      value={{
        routes,
        ...routerMenus,
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

function isNonIndexRoute(route: RouteObject): route is Exclude<RouteObject, { index: true }> {
  return !('index' in route);
}

const routerMappedIconName: Record<string, { icon: IconType; name: string }> = {
  [Router.UI]: { icon: RxComponent1, name: 'UI 컴포넌트' },
  [Router.GRID_EXAMPLE]: { icon: GoTable, name: '그리드 예시' },
  [Router.FILE_UPLOAD_DOWNLOAD]: { icon: FaRegFile, name: '파일 업로드/다운로드' },
  [Router.EXCEL_UPLOAD_DOWNLOAD]: { icon: RiFileExcel2Line, name: 'Excel 업로드/다운로드' },
  [Router.ROLE_MANAGEMENT]: { icon: MdOutlineManageAccounts, name: '메뉴/버튼 권한관리' },
  [Router.MY_PROFILE]: { icon: IoPersonCircleOutline, name: '내정보' },
};

function useRouterMenus() {
  const [menus, setMenus] = useState<TMenu[]>([]);

  const sidebarMainMenus = menus.filter((menu) => menu.router !== Router.MY_PROFILE);
  const myProfileMenu = menus.find((menu) => menu.router === Router.MY_PROFILE)!;

  return { menus, setMenus, sidebarMainMenus, myProfileMenu };
}
