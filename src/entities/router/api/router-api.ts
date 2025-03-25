import { apiRequest, customedAxios } from '@/shared/api';
import {
  PMenuMemberAuth,
  RMenuList,
  RMenuMemberAuthList,
  PMenuMemberAuthList,
  RMemberList,
  RMenuMemberAuth,
} from '../model/router-type.ts';

export async function getMenuMemberAuthApi(params: PMenuMemberAuth) {
  return await apiRequest<{ menuMemberAuth: RMenuMemberAuth }>(
    customedAxios.get('/member/getMenuMemberAuth', {
      params,
    }),
  );
}

export async function getMemberMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/member/getMemberMenuList'));
}

export async function getMemberListApi() {
  return await apiRequest<RMemberList>(customedAxios.get('/v1/member/list'));
}

export async function getMenuMemberAuthListApi(params: PMenuMemberAuthList) {
  return await apiRequest<RMenuMemberAuthList>(
    customedAxios.get('/member/getMenuMemberAuthList', {
      params,
    }),
  );
}

export async function updateMenuMemberAuthApi(data: RMenuMemberAuth[]) {
  return await apiRequest<null>(customedAxios.put('/v1/member/menuAuth', data));
}
