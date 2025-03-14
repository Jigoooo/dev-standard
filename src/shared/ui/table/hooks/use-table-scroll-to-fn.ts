import { elementScroll, VirtualizerOptions } from '@tanstack/react-virtual';
import { RefObject, useCallback, useRef } from 'react';

import { easeInOutQuint } from 'shared/ui';

export function useTableScrollToFn(bodyRef: RefObject<HTMLDivElement | null>) {
  const scrollingRef = useRef<number>(null);

  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] = useCallback(
    (offset, canSmooth, instance) => {
      const duration = 1000;
      const start = bodyRef.current?.scrollTop || 0;
      const startTime = (scrollingRef.current = Date.now());

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
        }
      };

      requestAnimationFrame(run);
    },
    [],
  );

  return scrollToFn;
}
