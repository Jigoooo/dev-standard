export interface ErrorStates {
  isError: boolean;
  error: any;
}

interface ErrorActions {
  setGlobalError: (error: any) => void;
}

export interface ErrorStoreInterface extends ErrorStates {
  actions: ErrorActions;
}
