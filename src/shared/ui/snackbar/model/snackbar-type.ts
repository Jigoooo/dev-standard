export enum SnackbarType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LOADING = 'loading',
}

export type SnackBarInfo = {
  id: string;
  title: string;
  message?: string;
  duration?: number;
  type?: SnackbarType;
};

export type SnackbarActions = {
  show: (snackBarInfo: Omit<SnackBarInfo, 'id'>) => void;
  hide: (id: string) => void;
};

export type SnackBarStates = {
  snackbarInfos: SnackBarInfo[];
};

export type TSnackBarStore = SnackBarStates & {
  actions: SnackbarActions;
};
