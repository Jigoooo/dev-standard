import { Router } from '@/entities/router';
import { IconType } from 'react-icons';

export type TMenu = {
  name: string;
  icon: IconType;
  router: Router;
};

export type TMenuState = {
  selectedMenu: TMenu;
};

export type TMenuStore = {
  state: TMenuState;
  actions: {
    setSelectedMenu: (menu: TMenu) => void;
  };
};
