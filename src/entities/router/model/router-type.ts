import type { IconType } from 'react-icons';
import type { JSX, ReactElement, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { MenuResponse, RMenuMemberAuth } from '@/shared/api';
import type { Router } from '@/shared/router';

export type TMenu = {
  isHeader: boolean;
  menuIndex: number;
  name: string;
  icon?: IconType;
  router: Router;
  fullRouterPath: string;
  display: boolean;
  orderBy: number;
  children?: TMenu[];
  mainCd: number;
  sub1Cd: number;
  sub2Cd: number;
  menuId: string;
  menuLink: string;
  menuLinkDev: string;
};

export type TCacheNode = {
  cacheKey: string;
  ele?: ReactNode | ReactElement | null | undefined | JSX.Element;
  lastActiveTime: number;
  renderCount: number;
};

export type TSidebarState = {
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  sidebarBackgroundColor: string;
};

export type TSidebarStore = {
  state: TSidebarState;
  actions: {
    toggleSidebarCollapsed: () => void;
  };
};

export type TRouterMenuContext = {
  routes: RouteObject[];
  menus: TMenu[];
  sidebarMainMenus: TMenu[];
  myProfileMenu: TMenu;
  excludeCacheMenuRouters: string[];
  lastLocation: string | null;
  setLastLocation: (lastLocation: string) => void;
  removeLastLocation: () => void;
  currentMenuMemberAuth: RMenuMemberAuth | null;
  setCurrentMenuMemberAuth: (menuMemberAuth: RMenuMemberAuth | null) => void;
  findCurrentMenu: (currentPath: string) => TMenu | null;
  findMenuWithFullRouterPath: (menus: TMenu[], targetFullRouterPath: string) => TMenu | null;
  findFirstNonHeaderMenu: (menus: TMenu[]) => TMenu | null;
  updateRouteChildren: (parentPath: string, newChildren: RouteObject[], merge?: boolean) => void;
  updateMainRouteChildren: (responseMenus: MenuResponse[]) => void;
  updateRoutes: (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => void;
  updateRouteName: (router: Router, newName: string) => void;
  makeGroupMenus: (menus: MenuResponse[]) => TMenu[];
  flattenGroupMenus: (menus: TMenu[]) => MenuResponse[];
};
