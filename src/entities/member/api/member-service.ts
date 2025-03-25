import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '@/entities/query';
import { getMemberInfoApi, updateMemberApi } from './member-api.ts';
import { RMember } from '@/entities/member';
import { loading } from '@/shared/ui';
import { PMemberInfo } from '@/entities/member/model/member-type.ts';

const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';

export function useGetMemberInfoQuery(params: PMemberInfo = {}) {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_INFO_QUERY_KEY, params],
    queryFn: () => getMemberInfoApi(params),
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
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
