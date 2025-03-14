import { ReactNode, RefObject } from 'react';

export type TModalRenderProps = {
  overlayRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  close: () => void;
};

export type TModalContext = {
  open: (render: (props: TModalRenderProps) => ReactNode) => void;
  close: () => void;
  setIsPossibleOverlayClose: (isPossibleOverlayClose: boolean) => void;
};
