import { useQueryWrapper } from '@/entities/query';
import { getMemberInfoApi } from './user-management-api.ts';
import { PMemberInfo } from '@/entities/user-management/model/user-management-type.ts';

const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';

export function useGetMemberInfoQuery(params: PMemberInfo = {}) {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_INFO_QUERY_KEY, params],
    queryFn: () => getMemberInfoApi(params),
  });
}
