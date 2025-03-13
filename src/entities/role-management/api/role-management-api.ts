import { apiRequest, customedAxios } from '@/shared/api';
import { PMemberList, RAuthMenu, RMenuMemberAuth, RRoleUserList } from '@/entities/role-management';

export async function getMemberListApi() {
  return apiRequest<RRoleUserList>(customedAxios.get('/member/getMemberList'));
}

export async function getMenuMemberAuthListApi(params: PMemberList) {
  return apiRequest<RMenuMemberAuth>(
    customedAxios.get('/member/getMenuMemberAuthList', {
      params,
    }),
  );
}

export async function updateMenuMemberAuthApi(data: RAuthMenu[]) {
  return apiRequest<null>(customedAxios.post('/member/updateMenuMemberAuth', data));
}
