import { create } from 'zustand';

import type { MemberState, MemberStore } from './member-type.ts';
import { useShallow } from 'zustand/react/shallow';

const initialState: MemberState = {
  memberInfo: {
    memberId: '',
    memberNm: '',
    memberPw: null,
    newMemberPw: null,
    email: '',
    phone: '',
    memberType: '',
    delYn: 'N',
    adminYn: 'N',
  },
};

const useMemberStore = create<MemberStore>()((setState) => {
  return {
    state: structuredClone(initialState),
    actions: {
      setMemberInfo: (memberInfo) => {
        setState((state) => ({
          ...state,
          state: {
            ...state.state,
            memberInfo,
          },
        }));
      },
    },
  };
});

export const memberActions = useMemberStore.getState().actions;
export const useMemberState = () => useMemberStore(useShallow((state) => state.state.memberInfo));
