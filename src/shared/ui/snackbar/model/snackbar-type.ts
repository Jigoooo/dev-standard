export enum SnackbarType {
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
  type?: SnackbarType;
}

export interface SnackbarActions {
  show: (snackBarInfo: SnackBarInfo) => void;
  hide: () => void;
}

export interface SnackBarStates {
  open: boolean;
  snackbarInfo: SnackBarInfo;
}

export interface SnackBarStoreInterface extends SnackBarStates {
  actions: SnackbarActions;
}
