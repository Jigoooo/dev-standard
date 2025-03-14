export enum SnackBarType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LOADING = 'loading',
}

export interface SnackBarInfo {
  title?: string;
  message: string;
  duration?: number;
  type?: SnackBarType;
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
