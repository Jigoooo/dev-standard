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

export type PMenuMemberAuth = {
  menuId: string;
};

export type RMenuMemberAuth = {
  menuId: string;
  menuTitle: string;
  mainTitle: string;
  subTitle: string;
  mainCd: number;
  sub2Cd: number;
  sub1Cd: number;
  orderBy: number;
  memberId: string;
  allChecked: boolean;
  useYn: YesNoType;
  authIns: YesNoType;
  authDel: YesNoType;
  authSearch: YesNoType;
  authMod: YesNoType;
  excelExport: YesNoType;
};

export type RMenu = {
  mainCd: number;
  sub1Cd: number;
  sub2Cd: number;
  orderBy: number;
  menuTitle: string;
  menuId: string;
  menuLink: string;
  menuLinkDev: string;
  displayYn: YesNoType;
};

export type RMenuList = {
  menuList: RMenu[];
};

export type PMenuMemberAuthList = {
  memberId: string;
};

export type RRoleUser = {
  memberId: string;
  memberNm: string;
};

export type RMemberList = {
  memberList: RRoleUser[];
};

export type RMenuMemberAuthList = {
  menuList: RMenuMemberAuth[];
};
