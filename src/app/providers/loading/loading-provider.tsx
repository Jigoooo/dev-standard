import { SyncLoading, useLoading } from '@/shared/components';
import { LOADING_Z_INDEX } from '@/shared/constants';

export function LoadingProvider() {
  const loadingState = useLoading();

  return (
    <>
      {loadingState.isLoading && loadingState.isActiveOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: LOADING_Z_INDEX,
            pointerEvents: 'auto',
          }}
        />
      )}
      <SyncLoading />
      {/*<MoonLoading />*/}
    </>
  );
}
