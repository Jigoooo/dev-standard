import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { menuActions, menus } from '@/entities/menu';

export function useSetSidebarSelectedMenu() {
  const location = useLocation();

  useEffect(() => {
    const findMenu = menus.find((menu) => location.pathname.includes(menu.router));
    if (findMenu) {
      menuActions.setSelectedMenu(findMenu);
    }
  }, []);
}
