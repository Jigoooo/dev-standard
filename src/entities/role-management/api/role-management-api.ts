import { apiRequest, customedAxios } from '@/shared/api';
import { PMemberList, RMenuMemberAuth, RRoleUserList } from '@/entities/role-management';

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
