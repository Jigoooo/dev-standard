import { apiRequest, customedAxios } from '@/shared/api';
import { RMenuList } from '@/entities/router';
import { PMenuMemberAuth } from '@/entities/router/model/router-type.ts';

export async function getMenuMemberAuthApi(params: PMenuMemberAuth) {
  return apiRequest<RMenuList>(
    customedAxios.get('/member/getMenuMemberAuth', {
      params,
    }),
  );
}

export async function getMenuListApi() {
  return apiRequest<RMenuList>(customedAxios.get('/member/getMemberMenuList'));
}
