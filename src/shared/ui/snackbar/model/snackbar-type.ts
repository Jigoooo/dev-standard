export enum SnackbarType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LOADING = 'loading',
}

export interface SnackBarInfo {
  id: string;
  title: string;
  message?: string;
  duration?: number;
  type?: SnackbarType;
}

export interface SnackbarActions {
  show: (snackBarInfo: Omit<SnackBarInfo, 'id'>) => void;
  hide: (id: string) => void;
}

export interface SnackBarStates {
  snackbarInfos: SnackBarInfo[];
}

export interface SnackBarStoreInterface extends SnackBarStates {
  actions: SnackbarActions;
}
