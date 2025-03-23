import { apiRequest, customedAxios } from '@/shared/api';
import { RMenuList } from '@/entities/router';

export async function getMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/menu/getMenuList'));
}
