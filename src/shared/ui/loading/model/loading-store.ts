import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { LoadingStates, LoadingStoreInterface } from './loading-type.ts';

const loadingInitialState: LoadingStates = {
  isLoading: false,
  isActiveOverlay: false,
  loadingText: '',
};

const useLoadingStore = create<LoadingStoreInterface>()((setState, getState) => {
  return {
    ...loadingInitialState,
    actions: {
      show: ({ loadingText = 'Loading...', isActiveOverlay = true } = {}) => {
        setState((state) => ({
          ...state,
          isLoading: true,
          isActiveOverlay,
          loadingText,
        }));
      },
      debounceShow: ({ delay = 300, ...rest } = {}) => {
        setTimeout(() => {
          getState().actions.show(rest);
        }, delay);
      },
      hide: () => {
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
export const loading = useLoadingStore.getState().actions;
