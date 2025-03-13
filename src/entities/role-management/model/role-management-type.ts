export type PMemberList = {
  memberId: string;
};

export type RRoleUser = {
  memberId: string;
  memberNm: string;
};

export type RAuthMenu = {
  menuId: string;
  menuTitle: string;
  mainCd: number;
  sub2Cd: number;
  sub1Cd: number;
  orderBy: number;
  memberId: string;
  useYn: 'Y' | 'N';
  authIns: 'Y' | 'N';
  authDel: 'Y' | 'N';
  authSearch: 'Y' | 'N';
  authMod: 'Y' | 'N';
  excelExport: 'Y' | 'N';
};

export type RRoleUserList = {
  menuList: RRoleUser[];
};

export type RMenuMemberAuth = {
  menuList: RAuthMenu[];
};
