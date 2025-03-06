import { ReactNode, useEffect } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (navigator.userAgent.includes('Windows')) {
      // 윈도우인 경우 폰트 렌더링이 달라 왜곡이 일어나는 현상 방지
      document.body.style.letterSpacing = '-0.2px';
      document.body.style.wordSpacing = '-1.4px';
      document.body.style.transform = 'rotate(0.03deg)';
    }

    return () => {
      document.body.style.letterSpacing = '';
      document.body.style.wordSpacing = '';
      document.body.style.transform = '';
    };
  }, []);

  return <>{children}</>;
}
