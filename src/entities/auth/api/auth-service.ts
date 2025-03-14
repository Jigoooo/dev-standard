import { useMutation } from '@tanstack/react-query';
import { signInApi, tokenCheckApi } from './auth-api.ts';
import { PSignIn } from '@/entities/auth/model';
import { useQueryWrapper } from '@/entities/query';
import { useEffect, useState } from 'react';

const TOKEN_SIGN_IN_QUERY_KEY = 'tokenSignInQueryKey';
const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';

export function useTokenSignInQuery() {
  return useQueryWrapper({
    queryKey: [TOKEN_SIGN_IN_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useTokenCheckQuery() {
  const interval = 1000 * 60 * 3; // 3분마다 체크

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnabled(true);
    }, interval);

    return () => clearTimeout(timer);
  }, []);

  return useQueryWrapper({
    queryKey: [TOKEN_CHECK_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: true,
    refetchInterval: interval,
    enabled,
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
