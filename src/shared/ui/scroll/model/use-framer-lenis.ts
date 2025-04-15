import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { LenisRef } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import { cancelFrame, frame } from 'framer-motion';

export function useFramerLenis<TRef extends HTMLElement>({
  lenisWrapperRef,
}: { lenisWrapperRef?: RefObject<TRef | null> } = {}) {
  const lenisRef = useRef<LenisRef>(null);
  const lenisOptions: LenisOptions = {
    autoRaf: false,
    duration: 0.6,
    wheelMultiplier: 1,
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

  const [lenisTopOffset, setLenisTopOffset] = useState(0);

  useEffect(() => {
    if (!lenisWrapperRef) return;

    if (lenisWrapperRef.current) {
      setLenisTopOffset(lenisWrapperRef.current.offsetTop);
    }
  }, [lenisWrapperRef]);

  return { lenisRef, lenisOptions, lenisTopOffset };
}
