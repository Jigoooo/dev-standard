import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { menuActions, menus, myProfileMenu } from '@/entities/menu';

export function useSetSelectedMenu() {
  const location = useLocation();

  useEffect(() => {
    const findMenu = [...menus, myProfileMenu].find((menu) =>
      location.pathname.includes(menu.router),
    );
    if (findMenu) {
      menuActions.setSelectedMenu(findMenu);
    }
  }, [location]);
}
