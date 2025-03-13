import { useQuery } from '@tanstack/react-query';
import { getMemberListApi, getMenuMemberAuthListApi } from './role-management-api.ts';
import { PMemberList } from '@/entities/role-management';

export const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
export const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

export function useGetMemberListApi() {
  return useQuery({
    queryKey: [GET_MEMBER_LIST_QUERY_KEY],
    queryFn: () => getMemberListApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useGetMenuMemberAuthListQuery(params: PMemberList) {
  return useQuery({
    queryKey: [GET_MENU_LIST_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthListApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}
