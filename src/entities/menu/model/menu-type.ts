import { ReactElement, ReactNode, JSX } from 'react';
import { IconType } from 'react-icons';

import { Router } from '@/entities/router';

export type TMenu = {
  menuIndex: number;
  name: string;
  icon: IconType;
  router: Router;
};

export type TMenuState = {
  sidebarCollapsed: boolean;
  delayedSidebarCollapsed: boolean;
  sidebarWidth: number;
  selectedMenu: TMenu;
};

export type TMenuStore = {
  state: TMenuState;
  actions: {
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
