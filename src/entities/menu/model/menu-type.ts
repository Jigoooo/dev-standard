import { SvgIconComponent } from '@mui/icons-material';
import { Router } from '@/entities/router';

export type TMenu = {
  name: string;
  icon: SvgIconComponent;
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
