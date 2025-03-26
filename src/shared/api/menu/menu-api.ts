import { apiRequest, customedAxios, RMenu, RMenuList } from '@/shared/api';

export async function getMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/v1/menu/info'));
}

export async function updateMenuApi(data: RMenu[]) {
  return await apiRequest<null>(customedAxios.put('/v1/menu/info', data));
}
