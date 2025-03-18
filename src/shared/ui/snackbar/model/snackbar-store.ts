import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { v4 as uuidV4 } from 'uuid';

import { SnackBarStates, TSnackBarStore, SnackbarType } from './snackbar-type.ts';

const snackBarInitialState: SnackBarStates = {
  snackbarInfos: [],
};

const useSnackBarStore = create<TSnackBarStore>()((setState) => {
  return {
    ...snackBarInitialState,
    actions: {
      show: ({ title, message, duration = 3000, type = SnackbarType.SUCCESS }) => {
        const id = uuidV4();

        setState((state) => {
          return {
            ...state,
            snackbarInfos: [
              ...state.snackbarInfos,
              {
                id,
                title,
                message,
                duration,
                type,
              },
            ],
          };
        });

        // setTimeout(() => {
        //   setState((state) => {
        //     return {
        //       ...state,
        //       snackbarInfos: state.snackbarInfos.filter((snackbar) => snackbar.id !== id),
        //     };
        //   });
        // }, duration);
      },
      hide: (id) => {
        setState((state) => {
          return {
            ...state,
            snackbarInfos: state.snackbarInfos.filter((snackbar) => snackbar.id !== id),
          };
        });
      },
    },
  };
});

export const useSnackbarInfos = () => useSnackBarStore(useShallow((state) => state.snackbarInfos));
export const snackbarActions = useSnackBarStore.getState().actions;
