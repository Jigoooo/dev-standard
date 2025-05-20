import type { Router } from '@/shared/router';

export type MembersParameter = {
  memberId: string;
};

export type MeResponse = {
  id: string;
  name: string;
  password: null;
  newPassword: null;
  email?: string;
  phoneNumber?: string;
  type: string;
  isDeleted: boolean;
  isAdmin: boolean;
};

export type MemberResponse = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
};

export type MemberData = {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  newPassword?: string;
  currentPassword?: string;
};

export type MenuMemberAuthPathVariable = {
  memberId: string;
};

export type MenuMemberAuthResponse = {
  canUse: boolean;
  canDelete: boolean;
  canExport: boolean;
  canInsert: boolean;
  canModify: boolean;
  canSearch: boolean;
  memberId: string;
  menuId: Router;
  orderBy: number;
  parentTitle: string;
  title: string;
};

export type MenuMemberAuthRequestConfig = {
  pathVariable: MenuMemberAuthPathVariable;
  data: MenuMemberAuthResponse[];
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

export type MenuMemberAuthsParameter = {
  memberId: string;
  menuId?: string;
};

export type RoleUserResponse = {
  id: string;
  name: string;
};
