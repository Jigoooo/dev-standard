import { Stack, Typography } from '@mui/joy';

import NoDataIcon from '@/shared/assets/images/no-data-icon.svg?react';

export function NoData({ emptyMessage }: { emptyMessage: string }) {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <NoDataIcon style={{ width: 50, height: 50, fill: '#000000' }} />
      <Typography sx={{ fontWeight: 600, color: '#000000' }}>{emptyMessage}</Typography>
    </Stack>
  );
}
