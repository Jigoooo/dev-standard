import { ReactNode, RefObject } from 'react';

export type TModalItem = {
  id: string;
  render: (props: TModalRenderProps) => ReactNode;
};

export type TModalRenderProps = {
  overlayRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  close: () => void;
};

export type TIsPossibleOverlayClose = {
  [key: string]: boolean;
};

export type TModalContext = {
  modalIds: { id: string }[];
  open: (id: string, render: (props: TModalRenderProps) => ReactNode) => void;
  close: (id: string) => void;
  handleIsPossibleOverlayClose: (id: string, possible: boolean) => void;
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
