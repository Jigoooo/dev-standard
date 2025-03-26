import { YesNoType } from '@/shared/type';

export type PMemberInfo = {
  memberId?: string;
};

export type RMember = {
  memberId: string;
  memberNm: string;
  memberPw: null;
  newMemberPw: null;
  email: string;
  phone: string;
  memberType: string;
  delYn: YesNoType;
  adminYn: YesNoType;
};

export type RMemberInfo = {
  memberInfo: RMember;
};
