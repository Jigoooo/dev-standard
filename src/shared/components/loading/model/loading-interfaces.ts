export const LoadingType = {
  SYNC_LOADING: 'syncLoading',
  MOON_LOADING: 'moonLoading',
} as const;

export type LoadingTypeBase = (typeof LoadingType)[keyof typeof LoadingType];

export interface LoadingStates {
  loadingStatuses: Record<LoadingTypeBase, boolean>;
  isActiveOverlay: boolean;
  syncLoadingText: string;
}

interface LoadingActions {
  showLoading: (type: LoadingTypeBase, syncLoadingText?: string, isActiveOverlay?: boolean) => void;
  hideLoading: (type: LoadingTypeBase) => void;
}

export interface LoadingStoreInterface extends LoadingStates {
  actions: LoadingActions;
}
