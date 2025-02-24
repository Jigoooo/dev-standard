import { useEffect } from 'react';

export function useBackKeyToClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    const handleBackKey = (event: PopStateEvent) => {
      if (isOpen) {
        onClose();
        event.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleBackKey);

    return () => {
      window.removeEventListener('popstate', handleBackKey);
    };
  }, [isOpen, onClose]);
}
