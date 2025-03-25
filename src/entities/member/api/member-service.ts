import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '@/entities/query';
import { tokenCheckApi, getMemberInfoApi, updateMemberApi } from './member-api.ts';
import { RMember } from '@/entities/member';
import { loading } from '@/shared/ui';
import { PMemberInfo } from '../model/member-type.ts';
import { GET_MEMBER_LIST_QUERY_KEY, Router } from '@/entities/router';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getToken } from '@/entities/auth';

const TOKEN_SIGN_IN_QUERY_KEY = 'tokenSignInQueryKey';
const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';
const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';

export function useTokenSignInQuery() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignInPage = location.pathname === Router.SIGN_IN;
  const token = getToken();

  return useQueryWrapper({
    queryKey: [TOKEN_SIGN_IN_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
    gcTime: 0,
    staleTime: 0,
    enabled: !!token && isSignInPage && !searchParams.get('isLogout'),
  });
}

export function useTokenCheckQuery() {
  const location = useLocation();
  const isSignInPage = location.pathname === Router.SIGN_IN;

  const interval = 1000 * 60 * 3; // 3분마다 체크

  // const [enabled, setEnabled] = useState(false);
  //
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setEnabled(true);
  //   }, interval);
  //
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  return useQueryWrapper({
    queryKey: [TOKEN_CHECK_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchIntervalInBackground: true,
    refetchInterval: interval,
    enabled: !isSignInPage,
  });
}

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
        queryKey: [GET_MEMBER_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
