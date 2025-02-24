import { useActiveOverlay } from '@/shared/components';
import { LOADING_Z_INDEX } from '@/shared/constants';

export const FuturOverlay = () => {
  const isActiveOverlay = useActiveOverlay();

  if (!isActiveOverlay) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0)',
        zIndex: LOADING_Z_INDEX,
        pointerEvents: 'auto',
      }}
    />
  );
};
