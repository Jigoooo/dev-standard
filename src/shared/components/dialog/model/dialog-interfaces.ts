import { OverridableStringUnion } from '@mui/types';
import { ColorPaletteProp } from '@mui/joy/styles/types';
import { SnackbarPropsColorOverrides } from '@mui/joy/Snackbar/SnackbarProps';
import { ReactNode } from 'react';

export interface DialogCustomButtons {
  label: string;
  color: OverridableStringUnion<ColorPaletteProp, SnackbarPropsColorOverrides>;
  callback: () => void;
}

export interface DialogInfoStates {
  title?: string;
  contents: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  withCancel?: boolean;
  color?: OverridableStringUnion<ColorPaletteProp, SnackbarPropsColorOverrides>;
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
