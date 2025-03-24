import { apiRequest, customedAxios } from '@/shared/api';
import { PMemberInfo } from '@/entities/user-management/model/user-management-type.ts';

export async function getMemberInfoApi(params: PMemberInfo) {
  return await apiRequest<null>(
    customedAxios.get('/member/getMemberInfo', {
      params,
    }),
  );
}
