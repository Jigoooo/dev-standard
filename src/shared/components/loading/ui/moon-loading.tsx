import { MoonLoader } from 'react-spinners';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

import { loadingStyles } from './loading-styles.ts';
import { LoadingType, useLoading, useSyncLoadingText } from '@/shared/components';

export function MoonLoading() {
  const loadingState = useLoading(LoadingType.MOON_LOADING);
  const moonLoadingText = useSyncLoadingText();

  return (
    <>
      {loadingState && (
        <Box className={'selection-none'} sx={[loadingStyles.loader, { gap: 1 }]}>
          <MoonLoader color={'#36d7b7'} size={50} />
          <Typography level='title-md' textColor={'white'}>
            {moonLoadingText}
          </Typography>
        </Box>
      )}
    </>
  );
}
