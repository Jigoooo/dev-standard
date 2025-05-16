import type { IconType } from 'react-icons';
import type { JSX, ReactElement, ReactNode } from 'react';
import type { RouteObject, DataRouter } from 'react-router-dom';

import type { MenuResponse, MenuMemberAuthResponse } from '@/shared/api';

export type Menu = Omit<MenuResponse, 'children'> & {
  icon?: IconType;
  children: Menu[];
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
  router: DataRouter;
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
  updateMainRouteChildren: (responseMenus: MenuResponse[]) => void;
  responseMenusToMenus: (responseMenus: MenuResponse[]) => Menu[];
};
