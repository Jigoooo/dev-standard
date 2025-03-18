import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { SnackBarStates, SnackBarStoreInterface, SnackbarType } from './snackbar-type.ts';

const snackBarInitialState: SnackBarStates = {
  open: false,
  snackbarInfo: {
    message: '',
    duration: 3000,
    type: SnackbarType.SUCCESS,
  },
};

const useSnackBarStore = create<SnackBarStoreInterface>()((setState) => {
  return {
    ...snackBarInitialState,
    actions: {
      show: ({ message = '', duration = 3000, type = SnackbarType.SUCCESS }) => {
        setState((state) => {
          return {
            ...state,
            open: true,
            snackbarInfo: {
              message,
              duration,
              type,
            },
          };
        });
      },
      hide: () => {
        setState((state) => {
          return { ...state, open: false };
        });
      },
    },
  };
});

export const useSnackbarOpen = () => useSnackBarStore(useShallow((state) => state.open));
export const useSnackbarInfo = () => useSnackBarStore(useShallow((state) => state.snackbarInfo));
export const snackbarActions = useSnackBarStore.getState().actions;
