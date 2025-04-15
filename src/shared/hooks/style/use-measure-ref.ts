import { useEffect, useRef, useState } from 'react';

export function useMeasureRef() {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newRect = entry.contentRect;
        setRect(newRect);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, rect] as const;
}
