import { create } from 'zustand';

import type { ErrorStoreInterface } from './error-type.ts';

const errorInitialState = {
  isError: false,
  error: null,
};

const useError = create<ErrorStoreInterface>()((setState) => {
  return {
    ...errorInitialState,
    actions: {
      setGlobalError: (error) => {
        setState((state) => ({ ...state, isError: true, error }));

        setTimeout(() => {
          setState((state) => ({ ...state, isError: false, error: null }));
        }, 10000);
      },
    },
  };
});

export const useErrorState = () => useError((state) => state.isError);
export const setGlobalError = (error: any) => useError.getState().actions.setGlobalError(error);
