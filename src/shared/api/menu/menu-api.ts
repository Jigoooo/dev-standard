import type { MenuResponse, MenuListResponse } from '@/shared/api';
import { apiRequest, customedAxios } from '@/shared/api';

export async function getMenuListApi() {
  return await apiRequest<MenuListResponse>(customedAxios.get('/v1/menus'));
}

export async function updateMenuApi(data: MenuResponse[]) {
  return await apiRequest<null>(customedAxios.put('/v1/menus', data));
}
