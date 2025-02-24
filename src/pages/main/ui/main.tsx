import { Box, Stack, Typography } from '@mui/joy';
import { Outlet } from 'react-router-dom';

import { menus } from '@/entities/menu';
import { MainMenuController, SidebarItems } from '@/widgets/main';

export function Main() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        minHeight: 600,
        backgroundColor: '#ffffff',
      }}
    >
      <Box sx={{ minWidth: 250, width: 250, height: '100%' }}>
        <Stack
          sx={{
            position: 'relative',
            backgroundColor: '#1e232e',
            height: '100%',
            py: 2,
            gap: 1.6,
          }}
        >
          <Box sx={{ px: 1.2, pb: 2 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              Home Manager
            </Typography>
          </Box>
          <SidebarItems menus={menus} />
        </Stack>
      </Box>

      <Stack sx={{ flexGrow: 1, height: '100%', overflowX: 'auto' }}>
        <Outlet />
      </Stack>

      <MainMenuController />
    </Box>
  );
}
