import { getMemberMenuListApi, getMenuMemberAuthApi } from './router-api.ts';
import { PMenuMemberAuth, Router } from '@/entities/router';
import { useQueryWrapper } from '@/entities/query';

export const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';
export const GET_MENU_LIST_QUERY_KEY = 'getMenuListQueryKey';

export function useGetMenuMemberAuthApiQuery(params: PMenuMemberAuth) {
  return useQueryWrapper({
    queryKey: [GET_MENU_MEMBER_AUTH_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled:
      params.menuId !== '' &&
      params.menuId !== Router.MAIN.slice(1) &&
      params.menuId !== Router.MY_PROFILE,
  });
}

export function useGetMemberMenuListQuery() {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMemberMenuListApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
    gcTime: 0,
    staleTime: 0,
  });
}
