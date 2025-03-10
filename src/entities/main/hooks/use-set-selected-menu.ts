import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { menuActions, myProfileMenu, useMenuState } from '@/entities/menu';

export function useSetSelectedMenu() {
  const location = useLocation();
  const menuState = useMenuState();

  useEffect(() => {
    const findMenu = [...menuState.menus, myProfileMenu].find((menu) =>
      location.pathname.includes(menu.router),
    );
    if (findMenu) {
      menuActions.setSelectedMenu(findMenu);
    }
  }, [location]);
}
