import { apiRequest, customedAxios } from '@/shared/api';
import { PMemberInfo, RMember, RMemberInfo } from '../model/member-type.ts';

export async function getMemberInfoApi(params: PMemberInfo) {
  return await apiRequest<RMemberInfo>(
    customedAxios.get('/member/getMemberInfo', {
      params,
    }),
  );
}

export async function updateSelfApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/member/myInfo', data));
}

export async function updateMemberApi(data: RMember) {
  return await apiRequest<null>(customedAxios.put('/v1/member/info', data));
}
