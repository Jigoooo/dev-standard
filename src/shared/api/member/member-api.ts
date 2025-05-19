import { apiRequest, customedAxios } from '../config';
import type {
  MembersParameter,
  MemberResponse,
  MenuMemberAuthResponse,
  MenuMemberAuthsParameter,
  MenuResponse,
  MeResponse,
  MemberData,
} from './member-type.ts';

const MEMBER_ENDPOINT = '/v1/members';

export async function getMeApi() {
  return await apiRequest<MeResponse>(customedAxios.get(`${MEMBER_ENDPOINT}/me`));
}

export async function getMemberApi(params: MembersParameter) {
  return await apiRequest<MemberResponse>(
    customedAxios.get(`${MEMBER_ENDPOINT}/${params.memberId}`),
  );
}

export async function getMembersApi() {
  return await apiRequest<MemberResponse[]>(customedAxios.get(MEMBER_ENDPOINT));
}

export async function updateMemberApi(data: MemberData) {
  return await apiRequest<null>(customedAxios.put(MEMBER_ENDPOINT, data));
}

export async function getMemberMenusApi() {
  return await apiRequest<MenuResponse[]>(customedAxios.get(`${MEMBER_ENDPOINT}/menus`));
}

export async function updateMenuApi(data: MenuResponse[]) {
  return await apiRequest<null>(customedAxios.put(`${MEMBER_ENDPOINT}/menus`, data));
}

export async function getMenuMemberAuthsApi(params: MenuMemberAuthsParameter) {
  return await apiRequest<MenuMemberAuthResponse[]>(
    customedAxios.get(`${MEMBER_ENDPOINT}/${params.memberId}/menu-auths`, {
      params: {
        menuId: params.menuId,
      },
    }),
  );
}

export async function updateMenuMemberAuthApi(data: MenuMemberAuthResponse[]) {
  return await apiRequest<null>(customedAxios.put(`${MEMBER_ENDPOINT}/menu-auth`, data));
}
