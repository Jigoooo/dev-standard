export type LoadingStates = {
  isLoading: boolean;
  isActiveOverlay: boolean;
  loadingText: string;
};

type LoadingActions = {
  showLoading: (options?: { loadingText?: string; isActiveOverlay?: boolean }) => void;
  hideLoading: () => void;
};

export type LoadingStoreInterface = LoadingStates & {
  actions: LoadingActions;
};
