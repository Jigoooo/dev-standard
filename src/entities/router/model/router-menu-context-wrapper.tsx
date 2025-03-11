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
import { RouterMenuContext } from '@/entities/router';
import { SignIn } from '@/pages/sign-in';
import { RouteErrorPage } from '@/shared/components';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';

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

  const routerMenus = useRouterMenus(routes);

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
  const updateRoutes = (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => {
    setRoutes((prevState) => updater(prevState));
  };

  return (
    <RouterMenuContext
      value={{
        routes,
        ...routerMenus,
        updateRouteChildren,
        updateRoutes,
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

function useRouterMenus(routes: RouteObject[]) {
  const mainRouter = routes.find((route) => route.path === Router.MAIN);
  const mainChildren = mainRouter?.children ?? [];

  const menus: TMenu[] = mainChildren.map((child) => {
    const menuIndex = Number(child.id?.split('-')[1] ?? '0');
    const childPath = child.path ?? '';
    return {
      menuIndex,
      name: routerMappedIconName[childPath].name,
      icon: routerMappedIconName[childPath].icon,
      router: childPath as Router,
      fullRouterPath: `${mainRouter?.path}/${child.path}`,
    };
  });

  const sidebarMainMenus = menus.filter((menu) => menu.router !== Router.MY_PROFILE);
  const myProfileMenu = menus.find((menu) => menu.router === Router.MY_PROFILE)!;

  return { menus, sidebarMainMenus, myProfileMenu };
}
