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
            ...dialogInitialState.dialogInfos,
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
              ...dialogInitialState.dialogInfos,
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
        setState(() => ({ ...dialogInitialState.dialogInfos, dialogOpen: false }));
      },
      success: (dialogInfos) => {
        getState().actions.open({ ...dialogInfos, dialogType: DialogType.SUCCESS });
      },
      error: (dialogInfos) => {
        getState().actions.open({ ...dialogInfos, dialogType: DialogType.ERROR });
      },
      warning: (dialogInfos) => {
        getState().actions.open({ ...dialogInfos, dialogType: DialogType.WARNING });
      },
      info: (dialogInfos) => {
        getState().actions.open({ ...dialogInfos, dialogType: DialogType.INFO });
      },
    },
  };
});

export const useDialogOpen = () => useDialog((state) => state.dialogOpen);
export const useDialogInfos = () => useDialog(useShallow((state) => state.dialogInfos));
export const dialog = useDialog.getState().actions;
