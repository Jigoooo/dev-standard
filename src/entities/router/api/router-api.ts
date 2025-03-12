import { RSignIn } from '@/entities/auth';
import { apiRequest, customedAxios } from '@/shared/api';

export async function getMenuListApi() {
  return apiRequest<RSignIn>(customedAxios.post('/member/getMemberMenuList', {}));
}
