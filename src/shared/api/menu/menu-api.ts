import type { MenuResponse, MenuListResponse } from '@/shared/api';
import { apiRequest, customedAxios } from '@/shared/api';

const MENU_ENDPOINT = '/v1/menus';

export async function getMenusApi() {
  return await apiRequest<MenuListResponse>(customedAxios.get(MENU_ENDPOINT));
}

export async function updateMenuApi(data: MenuResponse[]) {
  return await apiRequest<null>(customedAxios.put(MENU_ENDPOINT, data));
}
