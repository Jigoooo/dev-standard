import { apiRequest, customedAxios } from '@/shared/api/config';
import { PMemberInfo, RMember, RMemberInfo } from '../model/member-type.ts';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get('/v1/member/token'));
}

export async function getMemberInfoApi(params: PMemberInfo) {
  const path = params.memberId ? `/${params.memberId}` : '';

  return await apiRequest<RMemberInfo>(customedAxios.get(`/v1/member/info${path}`));
}

export async function updateSelfApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/member/myInfo', data));
}

export async function updateMemberApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/member/info', data));
}
