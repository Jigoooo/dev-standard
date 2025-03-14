import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { DialogStates, DialogStoreInterface, DialogType } from './dialog-type.ts';

const dialogInitialState: DialogStates = {
  dialogOpen: false,
  dialogInfos: {
    title: '',
    contents: '',
    confirmText: '확인',
    cancelText: '취소',
    withCancel: false,
    overlayClose: false,
    dialogType: DialogType.INFO,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

const useDialog = create<DialogStoreInterface>()((setState, getState) => {
  return {
    ...dialogInitialState,
    actions: {
      open: (dialogInfos) => {
        setState((state) => ({
          ...state,
          dialogOpen: true,
          dialogInfos: {
            ...state.dialogInfos,
            ...dialogInfos,
            onConfirm: () => {
              if (dialogInfos.onConfirm) dialogInfos.onConfirm();
              getState().actions.close();
            },
            onCancel: () => {
              if (dialogInfos.onCancel) dialogInfos.onCancel();
              getState().actions.close();
            },
          },
        }));
      },
      openAsync: (dialogInfos) =>
        new Promise((resolve) => {
          setState((state) => ({
            ...state,
            dialogOpen: true,
            dialogInfos: {
              ...state.dialogInfos,
              ...dialogInfos,
              onConfirm: () => {
                if (dialogInfos.onConfirm) dialogInfos.onConfirm();
                getState().actions.close();
                resolve(true);
              },
              onCancel: () => {
                if (dialogInfos.onCancel) dialogInfos.onCancel();
                getState().actions.close();
                resolve(false);
              },
            },
          }));
        }),
      close: () => {
        setState((state) => ({ ...state, dialogOpen: false }));
      },
    },
  };
});

export const useDialogOpen = () => useDialog((state) => state.dialogOpen);
export const useDialogInfos = () => useDialog(useShallow((state) => state.dialogInfos));
export const dialogActions = useDialog.getState().actions;
