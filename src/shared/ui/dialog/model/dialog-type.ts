import type { ReactNode } from 'react';

export type DialogInfoStates = {
  title?: string;
  contents?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  withCancel?: boolean;
  overlayClose?: boolean;
  dialogType?: DialogType;
};
export type DialogStates = {
  dialogOpen: boolean;
  dialogInfos: DialogInfoStates;
};

type DialogActions = {
  open: (openDialog: DialogInfoStates) => void;
  openAsync: (openDialog: DialogInfoStates) => Promise<boolean>;
  close: () => void;
  success: (openDialog: DialogInfoStates) => void;
  error: (openDialog: DialogInfoStates) => void;
  warning: (openDialog: DialogInfoStates) => void;
  info: (openDialog: DialogInfoStates) => void;
};

export type DialogStoreInterface = DialogStates & {
  actions: DialogActions;
};

export enum DialogType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
