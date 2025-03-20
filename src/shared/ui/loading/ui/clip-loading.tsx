import { ClipLoader } from 'react-spinners';

import { loadingStyles } from './loading-styles.ts';
import { Typography, useLoading } from '@/shared/ui';

export function ClipLoading() {
  const loadingState = useLoading();

  return (
    <div className={'selection-none'} style={loadingStyles.loader}>
      <ClipLoader color={'#6495ED'} size={60} speedMultiplier={1.2} />
      <Typography style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 500 }}>
        {loadingState.loadingText}
      </Typography>
    </div>
  );
}
