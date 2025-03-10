import { RefObject, useState, useEffect } from 'react';

export function useElementSize(ref: RefObject<HTMLElement | null>): {
  width: number;
  height: number;
} {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width === 0 || entry.contentRect.height === 0) {
          return;
        }

        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
        // 최초 측정 후 바로 observer를 해제하여 이후 업데이트를 막음
        // observer.disconnect();
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return size;
}
