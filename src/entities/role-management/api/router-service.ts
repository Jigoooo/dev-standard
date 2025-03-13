import { useQuery } from '@tanstack/react-query';
import { getMenuMemberAuthListApi } from './router-api.ts';

export const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

export function useGetMenuMemberAuthListQuery() {
  return useQuery({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMenuMemberAuthListApi(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
