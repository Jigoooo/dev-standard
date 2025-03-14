import { MoonLoader } from 'react-spinners';

import { loadingStyles } from './loading-styles.ts';
import { Typography, useLoading } from 'shared/ui';

export function MoonLoading() {
  const loadingState = useLoading();

  return (
    <>
      {loadingState.isLoading && (
        <div className={'selection-none'} style={{ ...loadingStyles.loader, ...{ gap: 8 } }}>
          <MoonLoader color={'#36d7b7'} size={50} />
          <Typography style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 500 }}>
            {loadingState.loadingText}
          </Typography>
        </div>
      )}
    </>
  );
}
