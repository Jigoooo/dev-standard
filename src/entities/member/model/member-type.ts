import type { MemberResponse } from '@/shared/api';

export type MemberState = {
  memberInfo: MemberResponse;
};

export type MemberStore = {
  state: MemberState;
  actions: {
    setMemberInfo: (memberInfo: MemberResponse) => void;
  };
};
