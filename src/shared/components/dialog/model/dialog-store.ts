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
    dialogType: DialogType.INFO,
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
        dialogType = DialogType.INFO,
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
            dialogType,
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
        dialogType = DialogType.INFO,
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
              dialogType,
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
export const dialogActions = useDialog.getState().actions;
