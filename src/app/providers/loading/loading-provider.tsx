import { FuturOverlay } from '@/shared/ui';
import { SyncLoading, MoonLoading } from '@/shared/components';

export function LoadingProvider() {
  return (
    <>
      <FuturOverlay />
      <SyncLoading />
      <MoonLoading />
    </>
  );
}
