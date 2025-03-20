import { useEffect } from 'react';

export function useModalClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    const addQueryParam = (key: string, value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set(key, value);
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState(null, '', newUrl);
    };

    if (isOpen) {
      addQueryParam('modal', 'true');
    }

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);
}
