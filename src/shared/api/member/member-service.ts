import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import {
  getMemberApi,
  updateMemberApi,
  getMembersApi,
  getMenuMemberAuthApi,
  getMenuMemberAuthListApi,
  updateMenuMemberAuthApi,
} from './member-api.ts';
import type {
  MemberResponse,
  MemberInfoParameter,
  MenuMemberAuthParameter,
  MenuMemberAuthResponse,
  MenuMemberAuthListParameter,
} from './member-type.ts';
import { Router } from '@/shared/router';
import { loading } from '@/shared/ui';

const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';
const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';
const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

export function useGetMemberInfoQuery(params: MemberInfoParameter = {}) {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_INFO_QUERY_KEY, params],
    queryFn: () => getMemberApi(params),
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberResponse) => updateMemberApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MEMBER_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useGetMenuMemberAuthQuery(params: MenuMemberAuthParameter) {
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
    queryFn: () => getMembersApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useGetMenuMemberAuthListQuery(params: MenuMemberAuthListParameter) {
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
    mutationFn: (data: MenuMemberAuthResponse[]) => updateMenuMemberAuthApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
