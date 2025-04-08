import { useEffect, useRef } from 'react';
import type { LenisRef } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import { cancelFrame, frame } from 'framer-motion';

export function useFramerLenis() {
  const lenisRef = useRef<LenisRef>(null);
  const lenisOptions: LenisOptions = {
    autoRaf: false,
    duration: 1.1,
    wheelMultiplier: 0.6,
    touchMultiplier: 0.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoResize: true,
  };

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return { lenisRef, lenisOptions };
}
