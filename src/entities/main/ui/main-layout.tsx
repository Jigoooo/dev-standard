import { ReactNode } from 'react';
import { Stack } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

import { MainHeader } from './main-header.tsx';

export function MainLayout({
  layoutSx,
  headerTitle,
  children,
}: {
  layoutSx?: SxProps;
  headerTitle: string;
  children: ReactNode;
}) {
  return (
    <Stack
      sx={[
        {
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          height: '100%',
          px: 2,
          py: 1,
          overflowX: 'auto',
        },
        ...(Array.isArray(layoutSx) ? layoutSx : [layoutSx]),
      ]}
    >
      <MainHeader title={headerTitle} />
      {children}
    </Stack>
  );
}
