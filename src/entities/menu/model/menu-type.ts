import { ReactElement, ReactNode, JSX } from 'react';
import { IconType } from 'react-icons';

import { Router } from '@/entities/router';

export type TMenu = {
  menuIndex: number;
  name: string;
  icon: IconType;
  router: Router;
  children?: TMenu[];
};

export type TMenuState = {
  menus: TMenu[];
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
  selectedMenu: TMenu;
};

export type TMenuStore = {
  state: TMenuState;
  actions: {
    setMenus: (menus: TMenu[]) => void;
    toggleSidebarCollapsed: () => void;
    setSelectedMenu: (menu: TMenu) => void;
  };
};

export type CacheNode = {
  cacheKey: string;
  ele?: ReactNode | ReactElement | null | undefined | JSX.Element;
  lastActiveTime: number;
  renderCount: number;
};
