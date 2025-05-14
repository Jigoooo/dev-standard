import type { IconType } from 'react-icons';
import type { JSX, ReactElement, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { MenuResponse, MenuMemberAuthResponse } from '@/shared/api';
import type { Router } from '@/shared/router';

export type Menu = {
  isHeader: boolean;
  menuIndex: number;
  name: string;
  icon?: IconType;
  router: Router;
  fullRouterPath: string;
  display: boolean;
  orderBy: number;
  children?: Menu[];
  mainCd: number;
  sub1Cd: number;
  sub2Cd: number;
  menuId: string;
  menuLink: string;
  menuLinkDev: string;
};

export type CacheNode = {
  cacheKey: string;
  ele?: ReactNode | ReactElement | null | undefined | JSX.Element;
  lastActiveTime: number;
  renderCount: number;
};

export type SidebarState = {
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  sidebarBackgroundColor: string;
};

export type SidebarStore = {
  state: SidebarState;
  actions: {
    toggleSidebarCollapsed: () => void;
  };
};

export type RouterMenuContextType = {
  routes: RouteObject[];
  menus: Menu[];
  sidebarMainMenus: Menu[];
  myProfileMenu: Menu;
  excludeCacheMenuRouters: string[];
  lastLocation: string | null;
  setLastLocation: (lastLocation: string) => void;
  removeLastLocation: () => void;
  currentMenuMemberAuth: MenuMemberAuthResponse | null;
  setCurrentMenuMemberAuth: (menuMemberAuth: MenuMemberAuthResponse | null) => void;
  findCurrentMenu: (currentPath: string) => Menu | null;
  findMenuWithFullRouterPath: (menus: Menu[], targetFullRouterPath: string) => Menu | null;
  findFirstNonHeaderMenu: (menus: Menu[]) => Menu | null;
  updateRouteChildren: (parentPath: string, newChildren: RouteObject[], merge?: boolean) => void;
  updateMainRouteChildren: (responseMenus: MenuResponse[]) => void;
  updateRoutes: (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => void;
  updateRouteName: (router: Router, newName: string) => void;
  makeGroupMenus: (menus: MenuResponse[]) => Menu[];
  flattenGroupMenus: (menus: Menu[]) => MenuResponse[];
};
