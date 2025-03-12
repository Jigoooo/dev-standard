import { useLocation, useNavigate } from 'react-router-dom';

import { SidebarItem } from './sidebar-item.tsx';
import { FlexColumn } from '@/shared/components';
import { TMenu } from '@/entities/router';

export function SidebarItems({ menus }: { menus: TMenu[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickMenu = (menu: TMenu) => {
    if (!menu.router) {
      return;
    }

    navigate(menu.router);
  };

  return (
    <FlexColumn style={{ width: '100%', alignItems: 'center' }}>
      {menus.map((menu, menuIndex) => {
        if (!menu.display) {
          return null;
        }

        const isSelected = menu.router ? location.pathname.includes(menu.router) : false;

        return (
          <FlexColumn style={{ width: '100%' }} key={menu.router}>
            <SidebarItem isSelected={isSelected} menu={menu} onClickMenu={onClickMenu} />
            {menuIndex < menus.length - 1 && (
              <div style={{ width: '100%', height: 1, backgroundColor: '#424242' }} />
            )}
          </FlexColumn>
        );
      })}
    </FlexColumn>
  );
}
