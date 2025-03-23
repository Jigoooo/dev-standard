import { apiRequest, customedAxios } from '@/shared/api';
import { RMenu, RMenuList } from '@/entities/router';

export async function getMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/menu/getMenuList'));
}

export async function updateMenuApi(data: RMenu[]) {
  return await apiRequest<null>(customedAxios.post('/menu/updateMenu', data));
}
