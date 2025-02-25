import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, Stack } from '@mui/joy';

import { TMenu } from '@/entities/menu';
import { SidebarItem } from './sidebar-item';
import { FlexDiv } from '@/shared/ui';

export function SidebarItems({ menus }: { menus: TMenu[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickMenu = (menu: TMenu) => {
    navigate(menu.router);
  };

  return (
    <Stack sx={{ width: '100%', alignItems: 'center' }}>
      {menus.map((menu, menuIndex) => {
        const isSelected = location.pathname.includes(menu.router);

        return (
          <FlexDiv flexDirection={'column'} style={{ width: '100%' }} key={menu.router}>
            <SidebarItem isSelected={isSelected} menu={menu} onClickMenu={onClickMenu} />
            {menuIndex < menus.length - 1 && <Divider sx={{ backgroundColor: '#424242' }} />}
          </FlexDiv>
        );
      })}
    </Stack>
  );
}
