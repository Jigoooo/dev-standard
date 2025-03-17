import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { TModalContext, TModalRenderProps } from './modal-type';

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

  const id = useMemo(() => uuidV4(), []);

  useEffect(() => {
    context.handleIsPossibleOverlayClose(id, isPossibleOverlayClose);
  }, [id, isPossibleOverlayClose]);

  return {
    ...context,
    open: (render: (props: TModalRenderProps) => ReactNode) => {
      context.open(id, render);
    },
    close: () => {
      context.close(id);
    },
    id,
  };
};
