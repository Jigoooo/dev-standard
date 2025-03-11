import { IconType } from 'react-icons';
import { JSX, ReactElement, ReactNode } from 'react';

export enum Router {
  SIGN_IN = '/',
  MAIN = '/main',
  MY_PROFILE = 'my-profile',
  UI = 'ui',
  GRID_EXAMPLE = 'grid-example',
  FILE_UPLOAD_DOWNLOAD = 'file-upload-download',
  EXCEL_UPLOAD_DOWNLOAD = 'excel-upload-download',
  ROLE_MANAGEMENT = 'role-management',
}

export type TMenu = {
  menuIndex: number;
  name: string;
  icon: IconType;
  router: Router;
  fullRouterPath: string;
  children?: TMenu[];
};

export type CacheNode = {
  cacheKey: string;
  ele?: ReactNode | ReactElement | null | undefined | JSX.Element;
  lastActiveTime: number;
  renderCount: number;
};

export type TRouterState = {
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
};

export type TRouterStore = {
  state: TRouterState;
  actions: {
    toggleSidebarCollapsed: () => void;
  };
};
