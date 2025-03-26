import { apiRequest, customedAxios } from '../config';
import {
  PMemberInfo,
  RMember,
  RMemberInfo,
  PMenuMemberAuth,
  RMenuList,
  RMenuMemberAuth,
  RMenuMemberAuthList,
  PMenuMemberAuthList,
  RMemberList,
} from './member-type.ts';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get('/v1/members/token'));
}

export async function getMemberInfoApi(params: PMemberInfo) {
  const path = params.memberId ? `/${params.memberId}` : '';

  return await apiRequest<RMemberInfo>(customedAxios.get(`/v1/members${path}`));
}

export async function updateSelfApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/members/my-info', data));
}

export async function updateMemberApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/members', data));
}

export async function getMenuMemberAuthApi(params: PMenuMemberAuth) {
  return await apiRequest<{ menuMemberAuth: RMenuMemberAuth }>(
    customedAxios.get(`/v1/members/menu-auth/${params.menuId}`),
  );
}

export async function getMemberMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/v1/members/menu-list'));
}

export async function getMemberListApi() {
  return await apiRequest<RMemberList>(customedAxios.get('/v1/members/list'));
}

export async function getMenuMemberAuthListApi(params: PMenuMemberAuthList) {
  const path = params?.memberId ? `/${params.memberId}` : '';

  return await apiRequest<RMenuMemberAuthList>(customedAxios.get(`/v1/members${path}/menu-auth`));
}

export async function updateMenuMemberAuthApi(data: RMenuMemberAuth[]) {
  return await apiRequest<null>(customedAxios.put('/v1/members/menu-auth', data));
}
