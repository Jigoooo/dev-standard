import { useEffect } from 'react';

export function useNativeMessageListener() {
  const listener = (event: MessageEvent | any) => {
    if (!event.data || event.data.source === 'react-devtools-bridge') return;
  };

  useEffect(() => {
    window.addEventListener('message', listener);
    document.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
      document.removeEventListener('message', listener);
    };
  }, []);
}
