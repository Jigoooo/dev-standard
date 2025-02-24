import { Box, Stack, Typography } from '@mui/joy';
import { useMatch, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/joy/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import Divider from '@mui/joy/Divider';

import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@/shared/ui';
import { ReactNode } from 'react';

type TSidebarItem = {
  title: string;
  path: string;
  fullPath: string;
  icon: OverridableComponent<SvgIconTypeMap>;
  children?: TSidebarItem[];
};

export function Sidebar({
  sidebarTitle,
  sidebarItems,
  onClickLogout,
}: {
  sidebarTitle: ReactNode;
  sidebarItems: TSidebarItem[];
  onClickLogout: () => void;
}) {
  return (
    <Box
      className={'selection-none'}
      sx={{
        width: 'var(--Sidebar-width)',
        minWidth: '250px',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#212121',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <SidebarHeader sidebarTitle={sidebarTitle} />
        <Divider sx={{ mx: 2.4, backgroundColor: '#555555', mb: 1 }} />
        <Stack component={'main'} sx={{ overflowY: 'auto', gap: 0.2, p: 1.5 }}>
          {sidebarItems.map((sidebarItem) => {
            return <SidebarItem key={sidebarItem.path} {...sidebarItem} />;
          })}
        </Stack>
        <Divider sx={{ mx: 2.4, mt: 'auto', backgroundColor: '#555555' }} />
        <SidebarFooter onClickLogout={onClickLogout} />
      </Stack>
    </Box>
  );
}

function SidebarHeader({ sidebarTitle }: { sidebarTitle: ReactNode }) {
  return (
    <Box
      component={'header'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
      }}
    >
      {sidebarTitle}
    </Box>
  );
}

function SidebarItem({ title, path, fullPath, icon: Icon }: TSidebarItem) {
  const theme = useTheme();

  const navigate = useNavigate();
  const matchPath = useMatch(fullPath);

  const moveToLink = () => navigate(path);

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          px: 1.2,
          py: 1,
          borderRadius: 12,
        },
        matchPath
          ? {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }
          : {
              '&:hover': {
                // transition: 'all 0.6s',
                // backgroundColor: theme.colorSchemes.light.palette.primary[200],
                // '& .MuiTypography-root': {
                //   color: 'white',
                // },
                '& .MuiSvgIcon-root': {
                  transition: 'all 0.2s',
                  color: theme.colorSchemes.light.palette.primary[500],
                },
              },
            },
      ]}
      onClick={moveToLink}
    >
      <Icon sx={{ fontSize: '1.2rem', color: matchPath ? theme.colorSchemes.light.palette.primary[500] : '#ffffff' }} />
      <Typography sx={[{ fontSize: '1rem', color: 'white' }]}>{title}</Typography>
    </Box>
  );
}

function SidebarFooter({ onClickLogout }: { onClickLogout: () => void }) {
  return (
    <Stack
      component={'footer'}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        p: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', px: 1.2 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Futur</Typography>
        <IconButton sx={{ color: '#999999' }} onClick={onClickLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}
