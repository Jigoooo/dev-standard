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
  },
];

function isNonIndexRoute(route: RouteObject): route is Exclude<RouteObject, { index: true }> {
  return !('index' in route);
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
        icon: routerMappedIcon[menuId],
        router: menuId,
        fullRouterPath: responseMenu.MENU_LINK,
      };
    });

    const newChildren = newMenus.map((menu) => {
      const Component = routerComponentMap[menu.router]!;
      return {
        path: menu.router,
        element: <Component />,
      };
    });

    setMenus((prevState) => {
      const updatedMenus = prevState.map((menu) => {
        const matching = newMenus.find((m) => m.router === menu.router);
        return matching ? matching : menu;
      });

      const newEntries = newMenus.filter(
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
