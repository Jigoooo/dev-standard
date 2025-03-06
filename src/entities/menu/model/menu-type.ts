import { Router } from '@/entities/router';
import { IconType } from 'react-icons';

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
