import { useQueryWrapper } from '@/entities/query';
import { getMemberInfoApi, updateMemberApi } from './member-api.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RMember } from '@/entities/member';

const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';

export function useGetMemberInfoQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_INFO_QUERY_KEY],
    queryFn: () => getMemberInfoApi(),
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RMember) => updateMemberApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MEMBER_INFO_QUERY_KEY],
      });
    },
  });
}
