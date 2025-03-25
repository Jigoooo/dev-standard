import { apiRequest, customedAxios } from '@/shared/api';
import { RMember, RMemberInfo } from '../model/member-type.ts';

export async function getMemberInfoApi() {
  return await apiRequest<RMemberInfo>(customedAxios.get('/member/getMemberInfo'));
}

export async function updateMemberApi(data: RMember) {
  return await apiRequest<null>(customedAxios.post('/member/updateMember', data));
}
