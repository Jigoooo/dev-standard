import { useMutation } from '@tanstack/react-query';
import { signInApi, tokenCheckApi } from './auth-api.ts';
import { PSignIn } from '@/entities/auth/model';
import { useQueryWrapper } from '@/entities/query';
import { getToken } from '@/entities/auth';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Router } from '@/entities/router';

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

  const interval = 1000 * 60 * 1; // 3분마다 체크

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

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: PSignIn) => signInApi(params),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
