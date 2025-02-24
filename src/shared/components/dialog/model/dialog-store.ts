import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { DialogInfoStates, DialogStates, DialogStoreInterface } from './dialog-interfaces.ts';

const dialogInitialState: DialogStates = {
  dialogOpen: false,
  dialogInfos: {
    title: '',
    contents: '',
    confirmText: '확인',
    cancelText: '취소',
    withCancel: false,
    color: 'primary',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

const useDialog = create<DialogStoreInterface>()((setState, getState) => {
  return {
    ...dialogInitialState,
    actions: {
      openDialog: ({
        title = '알림',
        contents,
        confirmText = '확인',
        cancelText = '취소',
        onConfirm = () => {},
        onCancel = () => {},
        withCancel = false,
        color = 'primary',
      }) => {
        setState((state) => ({
          ...state,
          dialogOpen: true,
          dialogInfos: {
            title: title,
            contents,
            confirmText,
            cancelText,
            onConfirm: () => {
              if (onConfirm) onConfirm();
              getState().actions.closeDialog();
            },
            onCancel: () => {
              if (onCancel) onCancel();
              getState().actions.closeDialog();
            },
            withCancel,
            color,
          },
        }));
      },
      openDialogAsync: ({
        title = '알림',
        contents,
        confirmText = '확인',
        cancelText = '취소',
        onConfirm = () => {},
        onCancel = () => {},
        withCancel = false,
        color = 'primary',
      }) =>
        new Promise((resolve) => {
          setState((state) => ({
            ...state,
            dialogOpen: true,
            dialogInfos: {
              ...state.dialogInfos,
              title: title,
              contents,
              confirmText,
              cancelText,
              onConfirm: () => {
                if (onConfirm) onConfirm();
                getState().actions.closeDialog();
                resolve(true);
              },
              onCancel: () => {
                if (onCancel) onCancel();
                getState().actions.closeDialog();
                resolve(false);
              },
              withCancel,
              color,
            },
          }));
        }),
      closeDialog: () => {
        setState((state) => ({ ...state, dialogOpen: false }));
      },
    },
  };
});

export const useDialogOpen = () => useDialog((state) => state.dialogOpen);
export const useDialogInfos = () => useDialog(useShallow((state) => state.dialogInfos));
export const openDialog = (dialogInfos: DialogInfoStates) =>
  useDialog.getState().actions.openDialog(dialogInfos);
export const openDialogAsync = (dialogInfos: DialogInfoStates) =>
  useDialog.getState().actions.openDialogAsync(dialogInfos);
export const closeDialog = () => useDialog.getState().actions.closeDialog();
