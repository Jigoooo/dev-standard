import { apiRequest, customedAxios } from '@/shared/api';
import { PMenuMemberAuth, RMenuMemberAuthList, RMenuList } from '@/entities/router';

export async function getMenuMemberAuthApi(params: PMenuMemberAuth) {
  return apiRequest<RMenuMemberAuthList>(
    customedAxios.get('/member/getMenuMemberAuth', {
      params,
    }),
  );
}

export async function getMemberMenuListApi() {
  return apiRequest<RMenuList>(customedAxios.get('/member/getMemberMenuList'));
}
