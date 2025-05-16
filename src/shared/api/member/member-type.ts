import type { YesNoType } from '@/shared/type';
import type { Router } from '@/shared/router';

export type MembersParameter = {
  memberId: string;
};

export type MemberResponse = {
  id: string;
  name: string;
  password: null;
  newPassword: null;
  email: string;
  phone: string;
  type: string;
  isDeleted: boolean;
  isAdmin: boolean;
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
  id: Router;
  title: string;
  link: string;
  componentName?: string;
  isDisplay: boolean;
  isGroup: boolean;
  orderBy: number;
  children: MenuResponse[];
};

export type MenuMemberAuthListParameter = {
  id: string;
};

export type RoleUserResponse = {
  id: string;
  name: string;
};
