import { useMutation } from '@tanstack/react-query';
import {
  getMemberListApi,
  getMenuMemberAuthListApi,
  updateMenuMemberAuthApi,
} from './role-management-api.ts';
import { PMenuMemberAuthList, RMenuMemberAuth } from '@/entities/role-management';
import { useQueryWrapper } from '@/shared/api';

export const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
export const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

export function useGetMemberListApi() {
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

export function useUpdateMenuMemberAuthService() {
  return useMutation({
    mutationFn: (data: RMenuMemberAuth[]) => updateMenuMemberAuthApi(data),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
