export type LoadingStates = {
  isLoading: boolean;
  isActiveOverlay: boolean;
  loadingText: string;
  timer: NodeJS.Timeout | null;
};

type LoadingActions = {
  show: (options?: { loadingText?: string; isActiveOverlay?: boolean }) => void;
  debounceShow: (options?: {
    delay?: number;
    loadingText?: string;
    isActiveOverlay?: boolean;
  }) => void;
  hide: () => void;
};

export type LoadingStoreInterface = LoadingStates & {
  actions: LoadingActions;
};
