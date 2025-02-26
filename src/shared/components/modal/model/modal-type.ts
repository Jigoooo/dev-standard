import { ReactNode } from 'react';

export type TModalContext = {
  open: (render: (props: { isOpen: boolean; close: () => void }) => ReactNode) => void;
  close: () => void;
  setIsPossibleOverlayClose: (isPossibleOverlayClose: boolean) => void;
};
