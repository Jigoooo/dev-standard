import { useMutation } from '@tanstack/react-query';
import { signInApi, tokenCheckApi } from './auth-api.ts';
import { PSignIn } from '@/entities/auth/model';
import { useQueryWrapper } from '@/entities/query';

const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';

export function useTokenCheckApi() {
  return useQueryWrapper({
    queryKey: [TOKEN_CHECK_QUERY_KEY],
    queryFn: () => tokenCheckApi(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 3, // 3분마다 체크
  });
}

export function useSignInService() {
  return useMutation({
    mutationFn: (params: PSignIn) => signInApi(params),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
