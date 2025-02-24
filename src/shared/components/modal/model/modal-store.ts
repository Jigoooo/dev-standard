import { create } from 'zustand';

import { ModalStates, ModalStoreInterface, ModalTypeBase } from './modal-type.ts';

const modalInitialState: ModalStates = {
  address: {
    isOpen: false,
  },
};

const useModalState = create<ModalStoreInterface>()((setState) => {
  return {
    ...modalInitialState,
    actions: {
      openModal: (modalType: ModalTypeBase) => {
        setState((state) => ({ ...state, [modalType]: { isOpen: true } }));
      },
      closeModal: (modalType: ModalTypeBase) => {
        setState((state) => ({ ...state, [modalType]: { isOpen: false } }));
      },
    },
  };
});

export const useModal = (modalType: ModalTypeBase) => useModalState((state) => state[modalType]);
export const openModal = (modalType: ModalTypeBase) =>
  useModalState.getState().actions.openModal(modalType);
export const closeModal = (modalType: ModalTypeBase) =>
  useModalState.getState().actions.closeModal(modalType);
