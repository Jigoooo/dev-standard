import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { LoadingStates, LoadingStoreInterface } from './loading-type.ts';

const loadingInitialState: LoadingStates = {
  isLoading: false,
  isActiveOverlay: false,
  loadingText: '',
};

const useLoadingStore = create<LoadingStoreInterface>()((setState) => {
  return {
    ...loadingInitialState,
    actions: {
      showLoading: ({ loadingText = '', isActiveOverlay = false } = {}) => {
        setState((state) => ({
          ...state,
          isLoading: true,
          isActiveOverlay,
          loadingText,
        }));
      },
      hideLoading: () => {
        setState((state) => ({
          ...state,
          isLoading: false,
          isActiveOverlay: false,
        }));
      },
    },
  };
});

export const useLoading = () => useLoadingStore(useShallow((state) => state));
export const loadingAction = useLoadingStore.getState().actions;
