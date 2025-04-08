import type { RefObject } from 'react';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

export function useModalController({
  modalRef,
  isOpen,
  onClose,
}: {
  modalRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isMobile) {
      return;
    }

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
        }
        if (event.key === 'Tab') {
          event.preventDefault();
          modalRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);
}
