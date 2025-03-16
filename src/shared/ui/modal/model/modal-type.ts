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

export type TMobileModal = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  defaultSize?: {
    width?: number | string;
    height?: number | string;
  };
  minSize?: {
    width?: number | string;
    height?: number | string;
  };
  maxSize?: {
    width?: number | string;
    height?: number | string;
  };
  children: ReactNode;
};
