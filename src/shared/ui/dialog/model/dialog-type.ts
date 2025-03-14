import { ReactNode } from 'react';

export interface DialogInfoStates {
  title?: string;
  contents: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  withCancel?: boolean;
  overlayClose?: boolean;
  dialogType?: DialogType;
}
export interface DialogStates {
  dialogOpen: boolean;
  dialogInfos: DialogInfoStates;
}

interface DialogActions {
  openDialog: (openDialog: DialogInfoStates) => void;
  openDialogAsync: (openDialog: DialogInfoStates) => Promise<boolean>;
  closeDialog: () => void;
}

export interface DialogStoreInterface extends DialogStates {
  actions: DialogActions;
}

export enum DialogType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
