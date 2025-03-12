import { apiRequest, customedAxios } from '@/shared/api';
import { RMenuList } from '@/entities/router';

export async function getMenuListApi() {
  return apiRequest<RMenuList>(customedAxios.get('/member/getMemberMenuList'));
}
