import { SyncLoader } from 'react-spinners';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

import { loadingStyles } from './loading-styles.ts';
import { LoadingType, useLoading, useSyncLoadingText } from '@/shared/components';

export function SyncLoading() {
  const loadingState = useLoading(LoadingType.SYNC_LOADING);
  const syncLoadingText = useSyncLoadingText();

  return (
    <>
      {loadingState && (
        <Box className={'selection-none'} sx={loadingStyles.loader}>
          <SyncLoader
            color={'#6495ED'}
            size={18}
            style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}
          />
          <Typography level='h4' component='h1' textColor={'white'}>
            {syncLoadingText}
          </Typography>
        </Box>
      )}
    </>
  );
}
