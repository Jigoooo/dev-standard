import type { YesNoType } from '@/shared/type';

export type MemberInfoParameter = {
  memberId?: string;
};

export type MemberResponse = {
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

export type MemberInfoResponse = {
  memberInfo: MemberResponse;
};

export type MenuMemberAuthParameter = {
  menuId: string;
};

export type MenuMemberAuthResponse = {
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

export type MenuResponse = {
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

export type MenuListResponse = {
  menuList: MenuResponse[];
};

export type MenuMemberAuthListParameter = {
  memberId: string;
};

export type RoleUserResponse = {
  memberId: string;
  memberNm: string;
};

export type MemberListResponse = {
  memberList: RoleUserResponse[];
};

export type MenuMemberAuthListResponse = {
  menuList: MenuMemberAuthResponse[];
};
