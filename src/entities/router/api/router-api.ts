import { apiRequest, customedAxios } from '@/shared/api';
import { PMenuMemberAuth, RMenuList, RMenuMemberAuthList } from '@/entities/router';

export async function getMenuMemberAuthApi(params: PMenuMemberAuth) {
  return await apiRequest<RMenuMemberAuthList>(
    customedAxios.get('/member/getMenuMemberAuth', {
      params,
    }),
  );
}

export async function getMemberMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/member/getMemberMenuList'));
}
