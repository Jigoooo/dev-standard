import { ModalProps } from '@mui/joy';
import { ReactNode } from 'react';

export const ModalType = {
  ADDRESS: 'address',
} as const;

export type ModalTypeBase = (typeof ModalType)[keyof typeof ModalType];

export interface FuturAnimatedModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  dialogTitle?: string;
}

interface ModalInfo {
  isOpen: boolean;
}

export interface ModalStates {
  address: ModalInfo;
}

interface ModalActions {
  openModal: (modalType: ModalTypeBase) => void;
  closeModal: (modalType: ModalTypeBase) => void;
}

export interface ModalStoreInterface extends ModalStates {
  actions: ModalActions;
}

export type TModalContext = {
  open: (render: (props: { isOpen: boolean; close: () => void }) => ReactNode) => void;
  close: () => void;
  setIsPossibleOverlayClose: (isPossibleOverlayClose: boolean) => void;
};
