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

const MEMBER_ENDPOINT = '/v1/members';

export async function getMemberApi(params: MemberInfoParameter) {
  const path = params.memberId ? `/${params.memberId}` : '';

  return await apiRequest<MemberInfoResponse>(customedAxios.get(`${MEMBER_ENDPOINT}${path}`));
}

export async function updateSelfApi(data: MemberResponse) {
  return await apiRequest<null>(customedAxios.put(`${MEMBER_ENDPOINT}/my-info`, data));
}

export async function updateMemberApi(data: MemberResponse) {
  return await apiRequest<null>(customedAxios.put(MEMBER_ENDPOINT, data));
}

export async function getMenuMemberAuthApi(params: MenuMemberAuthParameter) {
  return await apiRequest<{ menuMemberAuth: MenuMemberAuthResponse }>(
    customedAxios.get(`${MEMBER_ENDPOINT}/menu-auth/${params.menuId}`),
  );
}

export async function getMemberMenusApi() {
  return await apiRequest<MenuListResponse>(customedAxios.get(`${MEMBER_ENDPOINT}/menus`));
}

export async function getMemberListApi() {
  return await apiRequest<MemberListResponse>(customedAxios.get(MEMBER_ENDPOINT));
}

export async function getMenuMemberAuthListApi(params: MenuMemberAuthListParameter) {
  const path = params?.memberId ? `/${params.memberId}` : '';

  return await apiRequest<MenuMemberAuthListResponse>(
    customedAxios.get(`${MEMBER_ENDPOINT}${path}/menu-auth`),
  );
}

export async function updateMenuMemberAuthApi(data: MenuMemberAuthResponse[]) {
  return await apiRequest<null>(customedAxios.put(`${MEMBER_ENDPOINT}/menu-auth`, data));
}
