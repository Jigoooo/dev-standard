import { apiRequest, customedAxios } from '@/shared/api';
import { RMemberInfo } from '../model/member-type.ts';

export async function getMemberInfoApi() {
  return await apiRequest<RMemberInfo>(customedAxios.get('/member/getMemberInfo'));
}
