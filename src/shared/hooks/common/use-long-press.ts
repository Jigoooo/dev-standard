import { useRef } from 'react';

export function useLongPress(onLongPress: () => void, delay = 500) {
  const timerRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  const start = () => {
    triggeredRef.current = false;
    timerRef.current = window.setTimeout(() => {
      onLongPress();
      triggeredRef.current = true;
    }, delay);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
  };
}
