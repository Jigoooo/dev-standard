export type LoadingStates = {
  isLoading: boolean;
  isActiveOverlay: boolean;
  loadingText: string;
};

type LoadingActions = {
  show: (options?: { loadingText?: string; isActiveOverlay?: boolean }) => void;
  hide: () => void;
};

export type LoadingStoreInterface = LoadingStates & {
  actions: LoadingActions;
};
