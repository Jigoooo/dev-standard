import { create } from 'zustand';

import type { MeState, MeStore } from './member-type.ts';
import { useShallow } from 'zustand/react/shallow';

const initialState: MeState = {
  me: {
    id: '',
    name: '',
    password: null,
    newPassword: null,
    email: '',
    phoneNumber: '',
    type: '',
    isDeleted: false,
    isAdmin: false,
  },
};

const useMeStore = create<MeStore>()((setState) => {
  return {
    state: structuredClone(initialState),
    actions: {
      setMe: (me) => {
        setState((state) => ({
          ...state,
          state: {
            ...state.state,
            me: me,
          },
        }));
      },
    },
  };
});

export const meActions = useMeStore.getState().actions;
export const useMeState = () => useMeStore(useShallow((state) => state.state.me));
