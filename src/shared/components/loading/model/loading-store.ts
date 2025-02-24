import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
  LoadingStates,
  LoadingStoreInterface,
  LoadingType,
  LoadingTypeBase,
} from './loading-interfaces.ts';

const loadingInitialState: LoadingStates = {
  loadingStatuses: Object.fromEntries(
    Object.values(LoadingType).map((type) => [type, false]),
  ) as Record<LoadingTypeBase, boolean>,
  isActiveOverlay: false,
  syncLoadingText: '',
};

const useLoadingStore = create<LoadingStoreInterface>()((setState, getState) => {
  return {
    ...loadingInitialState,
    actions: {
      showLoading: (type, syncLoadingText = '', isActiveOverlay = true) => {
        setState((state) => ({
          ...state,
          loadingStatuses: { ...state.loadingStatuses, [type]: true },
          isActiveOverlay,
          syncLoadingText: syncLoadingText !== '' ? syncLoadingText : getState().syncLoadingText,
        }));
      },
      hideLoading: (type) => {
        setState((state) => ({
          ...state,
          loadingStatuses: { ...state.loadingStatuses, [type]: false },
          isActiveOverlay: false,
        }));
      },
    },
  };
});

export const useLoading = (type: LoadingTypeBase) =>
  useLoadingStore(useShallow((state) => state.loadingStatuses[type]));
export const useActiveOverlay = () => useLoadingStore((state) => state.isActiveOverlay);
export const useSyncLoadingText = () => useLoadingStore((state) => state.syncLoadingText);

export const showLoading = (
  type: LoadingTypeBase,
  syncLoadingText?: string,
  isActiveOverlay?: boolean,
) => useLoadingStore.getState().actions.showLoading(type, syncLoadingText, isActiveOverlay);
export const hideLoading = (type: LoadingTypeBase) =>
  useLoadingStore.getState().actions.hideLoading(type);
