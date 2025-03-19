import { useQueryWrapper } from '@/entities/query';
import { getMemberInfoApi } from './member-api.ts';

const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';

export function useGetMemberInfoQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_INFO_QUERY_KEY],
    queryFn: () => getMemberInfoApi(),
  });
}
