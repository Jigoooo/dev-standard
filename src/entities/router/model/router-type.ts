import { IconType } from 'react-icons';
import { JSX, ReactElement, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

export enum Router {
  SIGN_IN = '/',
  MAIN = '/main',
  MY_PROFILE = 'my-profile',
  COMPONENT = 'component',
  UI = 'ui',
  GRID_EXAMPLE = 'grid-example',
  FILE = 'file',
  FILE_UPLOAD_DOWNLOAD = 'file-upload-download',
  EXCEL_UPLOAD_DOWNLOAD = 'excel-upload-download',
  MANAGER = 'manager',
  ROLE_MANAGEMENT = 'role-management',
}

export type TMenu = {
  isHeader: boolean;
  menuIndex: number;
  name: string;
  icon?: IconType;
  router: Router;
  fullRouterPath: string;
  display: boolean;
  children?: TMenu[];
};

export type TCacheNode = {
  cacheKey: string;
  ele?: ReactNode | ReactElement | null | undefined | JSX.Element;
  lastActiveTime: number;
  renderCount: number;
};

export type TRouterState = {
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  sidebarBackgroundColor: string;
};

export type TRouterStore = {
  state: TRouterState;
  actions: {
    toggleSidebarCollapsed: () => void;
  };
};

export type PMenuMemberAuth = {
  menuId: string;
};

export type RMenuMemberAuth = {
  authIns: string;
  authDel: string;
  menuId: string;
  useYn: string;
  authSearch: string;
  authMod: string;
  memberId: string;
  excelExport: string;
};

export type RMenuMemberAuthList = {
  menuMemberAuth: RMenuMemberAuth;
};

export type RMenu = {
  mainCd: number;
  sub1Cd: number;
  sub2Cd: number;
  orderBy: number;
  menuId: string;
  menuTitle: string;
  menuLink: string;
  displayYn: 'Y' | 'N';
};

export type RMenuList = {
  menuList: RMenu[];
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
  findCurrentMenu: (currentPath: string) => TMenu | null;
  findMenuWithFullRouterPath: (menus: TMenu[], targetFullRouterPath: string) => TMenu | null;
  findFirstNonHeaderMenu: (menus: TMenu[]) => TMenu | null;
  updateRouteChildren: (parentPath: string, newChildren: RouteObject[], merge?: boolean) => void;
  updateMainRouteChildren: (responseMenus: RMenu[]) => void;
  updateRoutes: (updater: (prevRoutes: RouteObject[]) => RouteObject[]) => void;
  updateRouteName: (router: Router, newName: string) => void;
};
