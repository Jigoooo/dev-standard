import { Box, Typography } from '@mui/joy';

import { menuActions, TMenu } from '@/entities/menu';

export function SidebarItem({
  isSelected,
  menu,
  onClickMenu,
}: {
  isSelected: boolean;
  menu: TMenu;
  onClickMenu: (menu: TMenu) => void;
}) {
  return (
    <Box
      key={menu.router}
      sx={{
        display: 'flex',
        width: '100%',
        gap: 1.4,
        alignItems: 'center',
        px: 1,
        py: 1,
        cursor: 'pointer',
        color: isSelected ? '#4ba7ff' : '#999999',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          color: '#ffffff',
        },
        transition: 'all 0.1s',
      }}
      onClick={() => {
        menuActions.setSelectedMenu(menu);
        onClickMenu(menu);
      }}
    >
      <menu.icon sx={{ color: 'inherit', fontSize: '1.4rem' }} />
      <Typography sx={{ color: 'inherit', fontSize: '0.84rem', fontWeight: 700 }}>
        {menu.name}
      </Typography>
    </Box>
  );
}
