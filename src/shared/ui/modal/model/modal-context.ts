import { createContext, useContext, useEffect } from 'react';
import { TModalContext } from './modal-type';

export const ModalContext = createContext<TModalContext | null>(null);

export const useModal = ({
  isPossibleOverlayClose = false,
}: {
  isPossibleOverlayClose?: boolean;
} = {}) => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  useEffect(() => {
    context.setIsPossibleOverlayClose(isPossibleOverlayClose);
  }, [isPossibleOverlayClose]);

  return context;
};
