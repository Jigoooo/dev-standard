import { getMenuMemberAuthApi } from './router-api.ts';
import { PMenuMemberAuth, Router } from '@/entities/router';
import { useQueryWrapper } from '@/entities/query';

export const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';

export function useGetMenuMemberAuthApiQuery(params: PMenuMemberAuth) {
  return useQueryWrapper({
    queryKey: [GET_MENU_MEMBER_AUTH_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthApi(params),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:
      params.menuId !== '' &&
      params.menuId !== Router.MAIN.slice(1) &&
      params.menuId !== Router.MY_PROFILE,
  });
}
