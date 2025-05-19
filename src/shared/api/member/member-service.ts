import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import {
  getMemberApi,
  updateMemberApi,
  getMembersApi,
  getMenuMemberAuthsApi,
  updateMenuMemberAuthApi,
  getMemberMenusApi,
  updateMenuApi,
  getMeApi,
} from './member-api.ts';
import type {
  MemberData,
  MembersParameter,
  MenuMemberAuthResponse,
  MenuMemberAuthsParameter,
  MenuResponse,
} from './member-type.ts';
import { Router } from '@/shared/router';
import { loading } from '@/shared/ui';

const GET_MEMBER_MENUS_QUERY_KEY = 'getMemberMenusQueryKey';
const GET_ME_QUERY_KEY = 'getMeQueryKey';
const GET_MEMBER_QUERY_KEY = 'getMemberQueryKey';
const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

export function useGetMeQuery() {
  return useQueryWrapper({
    queryKey: [GET_ME_QUERY_KEY],
    queryFn: () => getMeApi(),
  });
}

export function useGetMemberMenusQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_MENUS_QUERY_KEY],
    queryFn: () => getMemberMenusApi(),
  });
}

export function useUpdateMemberMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MenuResponse[]) => updateMenuApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MEMBER_MENUS_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useGetMemberQuery(params: MembersParameter) {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_QUERY_KEY, params],
    queryFn: () => getMemberApi(params),
    enabled: !!params.memberId,
  });
}

export function useGetMembersQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_LIST_QUERY_KEY],
    queryFn: () => getMembersApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberData) => updateMemberApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MEMBER_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useGetMenuMemberAuthsQuery(params: MenuMemberAuthsParameter) {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthsApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled:
      !!params.memberId &&
      params.menuId !== Router.MAIN.slice(1) &&
      params.menuId !== Router.MY_PROFILE,
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
