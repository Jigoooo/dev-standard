import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { LoadingStates, LoadingStoreInterface } from './loading-type.ts';

const loadingInitialState: LoadingStates = {
  isLoading: false,
  isActiveOverlay: false,
  loadingText: '',
  timer: null,
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
        const timer = setTimeout(() => {
          getState().actions.show(rest);
          setState((prevState) => {
            return {
              ...prevState,
              timer: null,
            };
          });
        }, delay);

        setState((prevState) => {
          return {
            ...prevState,
            timer,
          };
        });
      },
      hide: () => {
        const { timer } = getState();
        if (timer) {
          clearTimeout(timer);
          setState((prevState) => {
            return {
              ...prevState,
              timer: null,
            };
          });
        }

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
