import { apiRequest, customedAxios } from '@/shared/api';
import {
  PMenuMemberAuthList,
  RMenuMemberAuth,
  RMenuMemberAuthList,
  RMemberList,
} from '@/entities/role-management';

export async function getMemberListApi() {
  return await apiRequest<RMemberList>(customedAxios.get('/member/getMemberList'));
}

export async function getMenuMemberAuthListApi(params: PMenuMemberAuthList) {
  return await apiRequest<RMenuMemberAuthList>(
    customedAxios.get('/member/getMenuMemberAuthList', {
      params,
    }),
  );
}

export async function updateMenuMemberAuthApi(data: RMenuMemberAuth[]) {
  return await apiRequest<null>(customedAxios.post('/member/updateMenuMemberAuth', data));
}
