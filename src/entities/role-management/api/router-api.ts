import { apiRequest, customedAxios } from '@/shared/api';
import { RMenuMemberAuth } from '@/entities/role-management';

export async function getMenuMemberAuthListApi() {
  return apiRequest<RMenuMemberAuth>(customedAxios.get('/member/getMenuMemberAuthList'));
}
