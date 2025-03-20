import { SyncLoading, useLoading } from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';

export function LoadingProvider() {
  const loadingState = useLoading();

  return (
    <FloatingPortal>
      {loadingState.isLoading && loadingState.isActiveOverlay && (
        <FloatingOverlay
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: zIndex.loading,
          }}
        />
      )}

      {loadingState.isLoading && (
        <>
          <SyncLoading />
          {/*<MoonLoading />*/}
        </>
      )}
    </FloatingPortal>
  );
}
