import { apiRequest, customedAxios, RMenu, RMenuList } from '@/shared/api';

export async function getMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/menu/getMenuList'));
}

export async function updateMenuApi(data: RMenu[]) {
  return await apiRequest<null>(customedAxios.post('/menu/updateMenu', data));
}
