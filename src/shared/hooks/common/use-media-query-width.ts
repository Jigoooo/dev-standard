import { useState, useEffect } from 'react';

export function useMediaQueryWidth(threshold: number): boolean {
  const [isMatched, setIsMatched] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(`(min-width: ${threshold}px)`).matches;
    }
    return false;
  });

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQueryList = window.matchMedia(`(min-width: ${threshold}px)`);

    const listener = (event: MediaQueryListEvent) => {
      setIsMatched(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [threshold]);

  return isMatched;
}
