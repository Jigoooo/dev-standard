import type { MemberResponse } from '@/shared/api';

export type MemberState = {
  member: MemberResponse;
};

export type MemberStore = {
  state: MemberState;
  actions: {
    setMemberId: (id: string) => void;
    setMember: (member: MemberResponse) => void;
  };
};
