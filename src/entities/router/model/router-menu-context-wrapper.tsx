import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import type { Menu, RouterMenuContextType } from './router-type.ts';
import { getLastLocation, removeLastLocation, RouterMenuContext, setLastLocation } from './';
import type { MenuMemberAuthResponse, MenuResponse } from '@/shared/api';
import { getMemberMenusApi, handleAuthError } from '@/shared/api';
import { getRouterComponent, getRouterMappedIcon, Router } from '@/shared/router';

function isNonIndexRoute(route: RouteObject): route is Exclude<RouteObject, { index: true }> {
  return !('index' in route);
}

export function RouterMenuContextWrapper({
  defaultRoutes,
  defaultMenus,
  excludeCacheMenuRouters = [],
  children,
}: {
  defaultRoutes: RouteObject[];
  defaultMenus: Menu[];
  excludeCacheMenuRouters?: string[];
  children: ReactNode;
}) {
  const [routes, setRoutes] = useState(defaultRoutes);
  const router = createBrowserRouter(routes);
  const [menus, setMenus] = useState<Menu[]>(defaultMenus);
  const [currentMenuMemberAuth, setCurrentMenuMemberAuth] = useState<MenuMemberAuthResponse | null>(
    null,
  );

  const sidebarMainMenus = menus.filter((menu) => menu.id !== Router.MY_PROFILE);
  const myProfileMenu = defaultMenus[0];
  const lastLocation = getLastLocation();

  const generateRoutesFromMenus = useCallback((menus: Menu[]): RouteObject[] => {
    return menus.map((menu) => {
      const Component = getRouterComponent(menu.id, menu.componentName);
      return {
        path: menu.id,
        element: menu.isDisplay && Component ? <Component /> : <Outlet />,
        children: menu.children ? generateRoutesFromMenus(menu.children) : undefined,
      };
    });
  }, []);

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

  const responseMenusToMenus = (responseMenus: MenuResponse[]) => {
    function enrichMenus(menus: MenuResponse[]): Menu[] {
      return menus.map((menu) => {
        const icon = getRouterMappedIcon(menu.id);

        return {
          ...menu,
          icon,
          children: enrichMenus(menu.children),
        };
      });
    }

    return enrichMenus(responseMenus);
  };

  const menusToResponseMenus = (menus: Menu[]): MenuResponse[] => {
    function enrichResponseMenus(menus: Menu[]): MenuResponse[] {
      return menus.map((menu) => {
        const children = menu.children ? enrichResponseMenus(menu.children) : [];

        return {
          ...menu,
          children,
        };
      });
    }

    return enrichResponseMenus(menus);
  };

  const updateMainRouteChildren = useCallback(
    (responseMenus?: MenuResponse[]) => {
      if (!responseMenus || responseMenus.length === 0) return;

      const groupMenus: Menu[] = responseMenusToMenus(responseMenus);

      function mergeMenusPreserve(prev: Menu[], next: Menu[]): Menu[] {
        const prevMap = new Map(prev.map((m) => [m.id, m]));

        const merged = next.map((m) => ({
          ...m,
          children: m.children
            ? mergeMenusPreserve(prevMap.get(m.id)?.children || [], m.children)
            : (prevMap.get(m.id)?.children ?? []),
        }));

        prev.forEach((m) => {
          if (!merged.find((x) => x.id === m.id)) {
            merged.push(m);
          }
        });

        return merged;
      }

      setMenus((prevState) => mergeMenusPreserve(prevState, groupMenus));

      const newRoutes = generateRoutesFromMenus(groupMenus);

      updateRouteChildren(Router.MAIN, newRoutes, true);
    },
    [generateRoutesFromMenus],
  );

  function findCurrentMenu(menus: Menu[], currentPath: string): Menu | null {
    for (const menu of menus) {
      if (currentPath.startsWith(menu.link)) {
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

  function findMenuWithFullRouterPath(menus: Menu[], targetFullRouterPath: string): Menu | null {
    for (const menu of menus) {
      if (targetFullRouterPath.startsWith(menu.link)) {
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

  function findFirstNonHeaderMenu(menus: Menu[]): Menu | null {
    for (const menu of menus) {
      if (!menu.isGroup) {
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

    if (window.location.pathname === Router.SIGN_IN) {
      return;
    }

    getMemberMenusApi().then((data) => {
      if (!data.isSuccess) {
        handleAuthError({
          data,
          onUnauthenticated: () => window.location.replace(Router.SIGN_IN),
          onRefreshSuccess: () => window.location.reload(),
        });

        return;
      }

      if (data.isSuccess && data.data) {
        updateMainRouteChildren(data.data);
      }
    });
  }, [sidebarMainMenus, updateMainRouteChildren]);

  if (sidebarMainMenus.length === 0 && window.location.pathname !== Router.SIGN_IN) {
    return null;
  }

  const contextValue: RouterMenuContextType = {
    router,
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
    updateMainRouteChildren,
    responseMenusToMenus,
    menusToResponseMenus,
  };

  return <RouterMenuContext value={contextValue}>{children}</RouterMenuContext>;
}
