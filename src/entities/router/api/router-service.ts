import { useQuery } from '@tanstack/react-query';
import { getMenuListApi, getMenuMemberAuthApi } from './router-api.ts';
import { PMenuMemberAuth } from '@/entities/router/model/router-type.ts';

export const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';
export const GET_MENU_LIST_QUERY_KEY = 'getMenuListQueryKey';

export function useGetMenuMemberAuthApiQuery(params: PMenuMemberAuth) {
  return useQuery({
    queryKey: [GET_MENU_MEMBER_AUTH_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: params.menuId !== '',
  });
}

export function useGetMenuListQuery() {
  return useQuery({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMenuListApi(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
