import { CSSProperties, useEffect, useState } from 'react';

const windowsStyle = {
  wordSpacing: '-1.4px',
  transform: 'rotate(0.03deg)',
  textShadow: '0 0 1px rgba(0,0,0,0.1)',
};

export function useWindowsStyle(): CSSProperties {
  const [isWindow, setIsWindow] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.includes('Windows')) {
      setIsWindow(true);
    }
  }, []);

  return isWindow ? windowsStyle : {};
}
