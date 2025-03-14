import NoDataIcon from '@/shared/assets/images/no-data-icon.svg?react';

import { FlexColumn, Typography } from 'shared/ui';

export function NoData({ emptyMessage }: { emptyMessage: string }) {
  return (
    <FlexColumn
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <NoDataIcon style={{ width: 50, height: 50, fill: '#000000' }} />
      <Typography style={{ fontWeight: 600, color: '#000000' }}>{emptyMessage}</Typography>
    </FlexColumn>
  );
}
