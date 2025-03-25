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
    customedAxios.get(`/v1/member/menuAuth/${params.menuId}`, {
      params,
    }),
  );
}

export async function getMemberMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/v1/member/menuList'));
}

export async function getMemberListApi() {
  return await apiRequest<RMemberList>(customedAxios.get('/v1/member/list'));
}

export async function getMenuMemberAuthListApi(params: PMenuMemberAuthList) {
  const path = params?.memberId ? `/${params.memberId}` : '';

  return await apiRequest<RMenuMemberAuthList>(customedAxios.get(`/v1/member${path}/menuAuth`));
}

export async function updateMenuMemberAuthApi(data: RMenuMemberAuth[]) {
  return await apiRequest<null>(customedAxios.put('/v1/member/menuAuth', data));
}
