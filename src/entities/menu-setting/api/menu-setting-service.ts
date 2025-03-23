import { useQueryWrapper } from '@/entities/query';
import { getMenuListApi } from './menu-setting-api.ts';

const GET_MENU_LIST_QUERY_KEY = 'getMenuListQueryKey';

export function useGetMenuListQuery() {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMenuListApi(),
  });
}
