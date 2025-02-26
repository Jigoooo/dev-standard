import { SyncLoader } from 'react-spinners';

import { loadingStyles } from './loading-styles.ts';
import { useLoading } from '@/shared/components';

export function SyncLoading() {
  const loadingState = useLoading();

  return (
    <>
      {loadingState.isLoading && (
        <div className={'selection-none'} style={loadingStyles.loader}>
          <SyncLoader
            color={'#6495ED'}
            size={18}
            style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}
          />
          <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 500 }}>
            {loadingState.loadingText}
          </span>
        </div>
      )}
    </>
  );
}
