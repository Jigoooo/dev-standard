import { useMutation } from '@tanstack/react-query';
import { useLocation, useSearchParams } from 'react-router-dom';

import { signInApi, tokenCheckApi } from './auth-api.ts';
import type { SignInParameter } from './auth-type.ts';
import { loading } from '@/shared/ui';
import { Router } from '@/shared/router';
import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import { getToken } from '@/shared/api';

const TOKEN_SIGN_IN_QUERY_KEY = 'tokenSignInQueryKey';
const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';

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

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: SignInParameter) => signInApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
