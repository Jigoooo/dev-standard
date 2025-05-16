import { create } from 'zustand';

import type { MemberState, MemberStore } from './member-type.ts';
import { useShallow } from 'zustand/react/shallow';

const initialState: MemberState = {
  member: {
    id: '',
    name: '',
    password: null,
    newPassword: null,
    email: '',
    phone: '',
    type: '',
    isDeleted: false,
    isAdmin: false,
  },
};

const useMemberStore = create<MemberStore>()((setState) => {
  return {
    state: structuredClone(initialState),
    actions: {
      setMemberId: (id) => {
        setState((state) => ({
          ...state,
          state: {
            ...state.state,
            member: {
              ...state.state.member,
              id,
            },
          },
        }));
      },
      setMember: (member) => {
        setState((state) => ({
          ...state,
          state: {
            ...state.state,
            member,
          },
        }));
      },
    },
  };
});

export const memberActions = useMemberStore.getState().actions;
export const useMemberState = () => useMemberStore(useShallow((state) => state.state.member));
