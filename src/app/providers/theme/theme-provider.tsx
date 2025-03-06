import { ReactNode, useEffect } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isWindows = navigator.userAgent.includes('Windows');

    if (isWindows) {
      document.documentElement.style.fontSize = '15px';
    }

    return () => {
      document.documentElement.style.fontSize = '16px';
    };
  }, []);

  return <>{children}</>;
}
