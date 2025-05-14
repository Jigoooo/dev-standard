import { apiRequest, customedAxios } from '../config';
import type {
  MemberInfoParameter,
  MemberResponse,
  MemberInfoResponse,
  MenuMemberAuthParameter,
  MenuListResponse,
  MenuMemberAuthResponse,
  MenuMemberAuthListResponse,
  MenuMemberAuthListParameter,
  MemberListResponse,
} from './member-type.ts';

export async function getMemberApi(params: MemberInfoParameter) {
  const path = params.memberId ? `/${params.memberId}` : '';

  return await apiRequest<MemberInfoResponse>(customedAxios.get(`/v1/members${path}`));
}

export async function updateSelfApi(data: MemberResponse) {
  return await apiRequest<null>(customedAxios.put('/v1/members/my-info', data));
}

export async function updateMemberApi(data: MemberResponse) {
  return await apiRequest<null>(customedAxios.put('/v1/members', data));
}

export async function getMenuMemberAuthApi(params: MenuMemberAuthParameter) {
  return await apiRequest<{ menuMemberAuth: MenuMemberAuthResponse }>(
    customedAxios.get(`/v1/members/menu-auth/${params.menuId}`),
  );
}

export async function getMemberMenusApi() {
  return await apiRequest<MenuListResponse>(customedAxios.get('/v1/members/menus'));
}

export async function getMemberListApi() {
  return await apiRequest<MemberListResponse>(customedAxios.get('/v1/members'));
}

export async function getMenuMemberAuthListApi(params: MenuMemberAuthListParameter) {
  const path = params?.memberId ? `/${params.memberId}` : '';

  return await apiRequest<MenuMemberAuthListResponse>(
    customedAxios.get(`/v1/members${path}/menu-auth`),
  );
}

export async function updateMenuMemberAuthApi(data: MenuMemberAuthResponse[]) {
  return await apiRequest<null>(customedAxios.put('/v1/members/menu-auth', data));
}
