import { useMutation } from '@tanstack/react-query';

import { useQueryWrapper } from '@/entities/query';
import {
  getMenuMemberAuthApi,
  getMemberListApi,
  getMenuMemberAuthListApi,
  updateMenuMemberAuthApi,
} from './router-api.ts';
import {
  PMenuMemberAuth,
  Router,
  PMenuMemberAuthList,
  RMenuMemberAuth,
} from '../model/router-type.ts';
import { loading } from '@/shared/ui';

export const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';
export const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
export const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

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

export function useGetMemberListQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_LIST_QUERY_KEY],
    queryFn: () => getMemberListApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useGetMenuMemberAuthListQuery(params: PMenuMemberAuthList) {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthListApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: params.memberId !== '',
  });
}

export function useUpdateMenuMemberAuthMutation() {
  return useMutation({
    mutationFn: (data: RMenuMemberAuth[]) => updateMenuMemberAuthApi(data),
    onSuccess: () => {},
    onMutate: () => loading.debounceShow(),
    onSettled: () => loading.hide(),
  });
}
