import { RMember } from '@/shared/api';

export type TMemberState = {
  memberInfo: RMember;
};

export type TMemberStore = {
  state: TMemberState;
  actions: {
    setMemberInfo: (memberInfo: RMember) => void;
  };
};
