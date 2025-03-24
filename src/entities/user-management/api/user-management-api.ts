import { apiRequest, customedAxios } from '@/shared/api';
import { PMemberInfo } from '../model/user-management-type.ts';
import { RMemberInfo } from '@/entities/member';

export async function getMemberInfoApi(params: PMemberInfo) {
  return await apiRequest<RMemberInfo>(
    customedAxios.get('/member/getMemberInfo', {
      params,
    }),
  );
}
