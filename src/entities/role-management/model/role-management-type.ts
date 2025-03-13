export type RRoleUser = {
  name: string;
};

export type RAuthMenu = {
  menuId: string;
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

export type RMenuMemberAuth = {
  menuList: RAuthMenu[];
};
