import type { MenuResponse, RMenuList } from '@/shared/api';
import { apiRequest, customedAxios } from '@/shared/api';

export async function getMenuListApi() {
  return await apiRequest<RMenuList>(customedAxios.get('/v1/menus'));
}

export async function updateMenuApi(data: MenuResponse[]) {
  return await apiRequest<null>(customedAxios.put('/v1/menus', data));
}
