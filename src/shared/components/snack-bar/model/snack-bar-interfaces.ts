import { OverridableStringUnion } from '@mui/types';
import { ColorPaletteProp, VariantProp } from '@mui/joy/styles/types';
import { SnackbarPropsColorOverrides } from '@mui/joy/Snackbar/SnackbarProps';
import { SnackbarPropsVariantOverrides } from '@mui/joy/Snackbar';

export interface SnackBarInfo {
  title?: string;
  message: string;
  duration?: number;
  color?: OverridableStringUnion<ColorPaletteProp, SnackbarPropsColorOverrides> | 'loading';
  variant?: OverridableStringUnion<VariantProp, SnackbarPropsVariantOverrides>;
}

export interface DesktopSnackBarInfo extends SnackBarInfo {
  idx: number;
}

export interface SnackbarActions {
  setTargetSizeMode: (targetSizeMode: 'mobile' | 'desktop') => void;
  showSnackBar: (snackBarInfo: SnackBarInfo) => void;
  showDesktopSnackBar: (notificationInfo: DesktopSnackBarInfo) => void;
  showNotification: (info: SnackBarInfo) => void;
  hideSnackBar: () => void;
  hideDesktopSnackBar: (idx: number) => void;
}

export interface SnackBarStates {
  targetSizeMode: 'mobile' | 'desktop';
  open: boolean;
  snackBarInfo: SnackBarInfo;
  desktopSnackBarInfos: DesktopSnackBarInfo[];
}

export interface SnackBarStoreInterface extends SnackBarStates {
  actions: SnackbarActions;
}
