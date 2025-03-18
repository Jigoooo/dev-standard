import { ReactNode, useEffect, useState } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import { RMenu, RMenuMemberAuth, Router, TMenu, TRouterMenuContext } from './router-type.ts';
import { getRouterComponent, getRouterMappedIcon, RouterMenuContext } from './';
import { getMemberMenuListApi } from '../api/router-api.ts';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';
import { ModalContextWrapper, RouteErrorPage } from '@/shared/ui';
import { sessionStorageKey } from '@/shared/constants';
import { AuthGuard, handleAuthError, MainAuthGuard } from '@/entities/auth';

const defaultRoutes: RouteObject[] = [
  {
    path: Router.SIGN_IN,
    element: (
      <AuthGuard>
        <ModalContextWrapper>
          <SignIn />
        </ModalContextWrapper>
      </AuthGuard>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: (
      <MainAuthGuard>
        <ModalContextWrapper>
          <Main />
        </ModalContextWrapper>
      </MainAuthGuard>
    ),
    errorElement: <RouteErrorPage />,
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
    isHeader: false,
    name: '내정보',
    icon: getRouterMappedIcon(Router.MY_PROFILE),
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
    if (!mainGroups.has(menu.mainCd)) {
      mainGroups.set(menu.mainCd, []);
    }
    mainGroups.get(menu.mainCd)!.push(menu);
  });

  const mainMenus: TMenu[] = [];

  for (const [mainCd, menus] of mainGroups.entries()) {
    const subGroups = new Map<number, RMenu[]>();
    let mainMenu: TMenu | null = null;

    menus.forEach((menu) => {
      if (!subGroups.has(menu.sub1Cd)) {
        subGroups.set(menu.sub1Cd, []);
      }

      if (menu.sub2Cd === 0) {
        const routerPath = menu.menuId as Router;
        const hasRouterComponent = !!getRouterComponent(routerPath);

        mainMenu = {
          menuIndex: mainCd,
          isHeader: !hasRouterComponent,
          name: menu.menuTitle,
          icon: getRouterMappedIcon(routerPath),
          display: menu.displayYn === 'Y',
          router: routerPath,
          fullRouterPath: menu.menuLink,
        };
      } else {
        subGroups.get(menu.sub1Cd)!.push(menu);
      }
    });

    let subMenus: TMenu[] = [];

    for (const [, subMenusArr] of subGroups.entries()) {
      subMenusArr.sort((a, b) => a.orderBy - b.orderBy);

      subMenus = subMenusArr.map((menu) => {
        const routerPath = menu.menuId as Router;
        const hasRouterComponent = !!getRouterComponent(routerPath);

        return {
          menuIndex: Number(`${menu.mainCd}${menu.sub1Cd}${menu.sub2Cd}`),
          isHeader: !hasRouterComponent,
          name: menu.menuTitle,
          icon: getRouterMappedIcon(routerPath),
          router: routerPath,
          fullRouterPath: menu.menuLink,
          display: menu.displayYn === 'Y',
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
    const Component = getRouterComponent(menu.router);
    return {
      path: menu.router,
      element: menu.display && Component ? <Component /> : <Outlet />,
      children: menu.children ? generateRoutesFromMenus(menu.children) : undefined,
    };
  });
}

export function RouterMenuContextWrapper({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState(defaultRoutes);
  const [menus, setMenus] = useState<TMenu[]>(defaultMenus);
  const [currentMenuMemberAuth, setCurrentMenuMemberAuth] = useState<RMenuMemberAuth | null>(null);

  const sidebarMainMenus = menus.filter((menu) => menu.router !== Router.MY_PROFILE);
  const myProfileMenu = defaultMenus[0];
  const excludeCacheMenuRouters = [
    `${Router.MAIN}/${Router.COMPONENT}`,
    `${Router.MAIN}/${Router.FILE}`,
    `${Router.MAIN}/${Router.MY_PROFILE}`,
  ];
  const lastLocation = sessionStorage.getItem(sessionStorageKey.LAST_LOCATION);

  const setLastLocation = (lastLocation: string) => {
    sessionStorage.setItem(sessionStorageKey.LAST_LOCATION, lastLocation);
  };

  const removeLastLocation = () => {
    sessionStorage.removeItem(sessionStorageKey.LAST_LOCATION);
  };

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
    if (!responseMenus || !Array.isArray(responseMenus)) {
      return;
    }

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
    const updateRecursively = (menus: TMenu[]): TMenu[] => {
      return menus.map((menu) => {
        let updatedMenu = menu.router === router ? { ...menu, name: newName } : menu;

        if (menu.children && menu.children.length > 0) {
          updatedMenu = {
            ...updatedMenu,
            children: updateRecursively(menu.children),
          };
        }
        return updatedMenu;
      });
    };

    setMenus((prevState) => updateRecursively(prevState));
  };

  function findCurrentMenu(menus: TMenu[], currentPath: string): TMenu | null {
    for (const menu of menus) {
      if (currentPath.startsWith(menu.fullRouterPath)) {
        if (menu.children) {
          const foundChild = findCurrentMenu(menu.children, currentPath);
          if (foundChild) {
            return foundChild;
          }
        }

        return menu;
      }
    }
    return null;
  }

  function findMenuWithFullRouterPath(menus: TMenu[], targetFullRouterPath: string): TMenu | null {
    for (const menu of menus) {
      if (targetFullRouterPath.startsWith(menu.fullRouterPath)) {
        if (menu.children) {
          const foundChild = findMenuWithFullRouterPath(menu.children, targetFullRouterPath);
          if (foundChild) {
            return foundChild;
          }
        }

        return menu;
      }
    }
    return null;
  }

  function findFirstNonHeaderMenu(menus: TMenu[]): TMenu | null {
    for (const menu of menus) {
      if (!menu.isHeader) {
        return menu;
      } else if (menu.children) {
        const foundChild = findFirstNonHeaderMenu(menu.children);
        if (foundChild) {
          return foundChild;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    if (sidebarMainMenus.length > 0) {
      return;
    }

    getMemberMenuListApi().then((data) => {
      if (location.pathname === Router.SIGN_IN) {
        return;
      }

      if (!data.success) {
        handleAuthError({
          data,
          onUnauthenticated: () => location.replace('/'),
          onRefreshSuccess: () => location.reload(),
        });

        return;
      }

      if (data.success && Array.isArray(data.data?.menuList)) {
        updateMainRouteChildren(data.data?.menuList);
      }
    });
  }, [sidebarMainMenus]);

  if (sidebarMainMenus.length === 0 && location.pathname !== Router.SIGN_IN) {
    return null;
  }

  return (
    <RouterMenuContext
      value={
        {
          routes,
          menus,
          sidebarMainMenus,
          myProfileMenu,
          excludeCacheMenuRouters,
          lastLocation,
          setLastLocation,
          removeLastLocation,
          currentMenuMemberAuth,
          setCurrentMenuMemberAuth,
          findCurrentMenu: (currentPath) => findCurrentMenu(menus, currentPath),
          findMenuWithFullRouterPath,
          findFirstNonHeaderMenu,
          updateRouteChildren,
          updateMainRouteChildren,
          updateRoutes,
          updateRouteName,
        } as TRouterMenuContext
      }
    >
      {children}
    </RouterMenuContext>
  );
}
