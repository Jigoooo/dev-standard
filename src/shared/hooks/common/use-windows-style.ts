import { CSSProperties, useEffect, useState } from 'react';

const windowsStyle = {
  wordSpacing: '-1.4px',
  transform: 'rotate(0.03deg)',
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
