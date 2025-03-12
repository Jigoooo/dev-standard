import { useQuery } from '@tanstack/react-query';
import { getMenuListApi } from './router-api.ts';

export const GET_MENU_LIST_QUERY_KEY = 'getMenuListQueryKey';

export function useGetMenuListQuery() {
  return useQuery({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMenuListApi(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
