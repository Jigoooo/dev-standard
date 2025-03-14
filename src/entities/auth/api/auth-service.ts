import { useMutation } from '@tanstack/react-query';
import { signInApi, tokenCheckApi } from './auth-api.ts';
import { PSignIn } from '@/entities/auth/model';
import { useQueryWrapper } from '@/entities/query';
import { useLocation } from 'react-router-dom';
import { Router } from '@/entities/router';

const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';

export function useTokenCheckQuery() {
  const location = useLocation();
  const isSignInPage = location.pathname === Router.SIGN_IN;

  return useQueryWrapper({
    queryKey: [TOKEN_CHECK_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: !isSignInPage,
    refetchInterval: !isSignInPage ? 1000 * 60 * 3 : undefined, // 3분마다 체크
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: PSignIn) => signInApi(params),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
