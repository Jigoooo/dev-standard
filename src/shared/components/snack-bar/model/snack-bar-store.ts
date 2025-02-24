import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { SnackBarStates, SnackBarStoreInterface, SnackBarInfo, DesktopSnackBarInfo } from './snack-bar-interfaces.ts';
import { timeoutAction } from '@/shared/lib';

const snackBarInitialState: SnackBarStates = {
  targetSizeMode: 'desktop',
  open: false,
  snackBarInfo: {
    message: '',
    duration: 3000,
    color: 'success',
    variant: 'soft',
  },
  desktopSnackBarInfos: [],
};

const useSnackBarStore = create<SnackBarStoreInterface>()((setState, getState) => {
  return {
    ...snackBarInitialState,
    actions: {
      setTargetSizeMode: (targetSizeMode) => {
        setState((state) => {
          return { ...state, targetSizeMode };
        });
      },
      showSnackBar: ({ message = '', duration = 3000, color = 'success', variant = 'soft' }) => {
        setState((state) => {
          return {
            ...state,
            open: true,
            snackBarInfo: {
              message,
              duration,
              color,
              variant,
            },
          };
        });
      },
      showDesktopSnackBar: ({ idx, title, message = '', duration = 5000, color = 'success', variant = 'soft' }) => {
        setState((state) => {
          return {
            ...state,
            desktopSnackBarInfos: [
              ...state.desktopSnackBarInfos,
              {
                idx,
                title,
                message,
                duration,
                color,
                variant,
              },
            ],
          };
        });

        duration !== 0 && timeoutAction(() => getState().actions.hideDesktopSnackBar(idx), duration);
      },
      showNotification: (info) => {
        const maxIdx = Math.max(...getState().desktopSnackBarInfos.map((info) => info.idx));
        let newIdx = maxIdx + 1;

        if (maxIdx === -Infinity) {
          newIdx = 0;
        }

        if (getState().targetSizeMode === 'mobile') {
          showSnackBar(info);
        } else {
          showDesktopSnackBar({
            ...info,
            idx: newIdx,
          });
        }
      },
      hideSnackBar: () => {
        setState((state) => {
          return { ...state, open: false };
        });
      },
      hideDesktopSnackBar: (idx) => {
        setState((state) => {
          return {
            ...state,
            desktopSnackBarInfos: state.desktopSnackBarInfos.filter((notificationInfo) => notificationInfo.idx !== idx),
          };
        });
      },
    },
  };
});

export const useSnackBarOpenState = () => useSnackBarStore(useShallow((state) => state.open));
export const useSnackBarInfo = () => useSnackBarStore(useShallow((state) => state.snackBarInfo));
export const useNotificationInfos = () => useSnackBarStore(useShallow((state) => state.desktopSnackBarInfos));
export const showSnackBar = (info: SnackBarInfo) => useSnackBarStore.getState().actions.showSnackBar(info);
export const showDesktopSnackBar = (notificationInfo: DesktopSnackBarInfo) =>
  useSnackBarStore.getState().actions.showDesktopSnackBar(notificationInfo);
export const showNotification = (info: SnackBarInfo) => useSnackBarStore.getState().actions.showNotification(info);
export const hideSnackBar = () => useSnackBarStore.getState().actions.hideSnackBar();
export const hideDesktopSnackBar = (idx: number) => useSnackBarStore.getState().actions.hideDesktopSnackBar(idx);
export const snackBarActions = useSnackBarStore.getState().actions;
