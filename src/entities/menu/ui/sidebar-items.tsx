import { useLocation, useNavigate } from 'react-router-dom';

import { TMenu } from '@/entities/menu';
import { SidebarItem } from './sidebar-item';
import { FlexColumn } from '@/shared/components';

export function SidebarItems({ menus }: { menus: TMenu[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickMenu = (menu: TMenu) => {
    navigate(menu.router);
  };

  return (
    <FlexColumn style={{ width: '100%', alignItems: 'center' }}>
      {menus.map((menu, menuIndex) => {
        const isSelected = location.pathname.includes(menu.router);

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
