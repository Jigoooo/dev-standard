import { useEffect, useState, ForwardedRef, forwardRef } from 'react';
import { CircularProgress } from '@mui/joy';
import Box from '@mui/joy/Box';

import { detectDeviceTypeAndOS } from '@/shared/lib';

const { isAndroid } = detectDeviceTypeAndOS();

export const PullToRefresh = forwardRef(
  ({ refreshFn = () => window.location.reload() }: { refreshFn: () => void }, ref: ForwardedRef<HTMLElement>) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);

    useEffect(() => {
      const handleTouchStart = (event: TouchEvent) => {
        if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
          setStartY(event.touches[0].clientY);
        }
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!isAndroid || window.scrollY !== 0 || document.documentElement.scrollTop !== 0) {
          return;
        }

        const moveY = event.touches[0].clientY;
        const pullDistance = moveY - startY;

        if (pullDistance > 0) {
          event.preventDefault();

          if (pullDistance > 300 && ref && 'current' in ref && ref.current) {
            ref.current.style.transform = 'translate(0, 80px)';
            ref.current.style.transition = '0.3s';
            setRefreshing(true);
          }
        }
      };

      const handleTouchEnd = () => {
        if (refreshing) {
          refreshFn();
          setTimeout(() => {
            setRefreshing(false);
            if (ref && 'current' in ref && ref.current) {
              ref.current.style.transform = 'translate(0,0)';
            }
          }, 1000);
        }
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }, [refreshing, startY, ref]);

    return (
      <Box
        sx={
          refreshing
            ? {
                position: 'absolute',
                top: 0,
                display: 'flex',
                width: '100vw',
              }
            : undefined
        }
      >
        {refreshing ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 8,
              width: '100vw',
              zIndex: 1000000,
            }}
          >
            <CircularProgress />
          </Box>
        ) : null}
      </Box>
    );
  },
);

PullToRefresh.displayName = 'PullToRefresh';
