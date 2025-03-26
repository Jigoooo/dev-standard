import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useSearchParams } from 'react-router-dom';

import { getToken } from '../config';
import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import {
  tokenCheckApi,
  getMemberInfoApi,
  updateMemberApi,
  getMemberListApi,
  getMenuMemberAuthApi,
  getMenuMemberAuthListApi,
  updateMenuMemberAuthApi,
} from './member-api.ts';
import {
  RMember,
  PMemberInfo,
  PMenuMemberAuth,
  RMenuMemberAuth,
  PMenuMemberAuthList,
} from './member-type.ts';
import { Router } from '@/shared/router';
import { loading } from '@/shared/ui';

const TOKEN_SIGN_IN_QUERY_KEY = 'tokenSignInQueryKey';
const TOKEN_CHECK_QUERY_KEY = 'tokenCheckQueryKey';
const GET_MEMBER_INFO_QUERY_KEY = 'getMemberInfoQueryKey';
const GET_MENU_MEMBER_AUTH_QUERY_KEY = 'getMenuMemberAuthQueryKey';
const GET_MEMBER_LIST_QUERY_KEY = 'getMemberListQueryKey';
const GET_MENU_LIST_QUERY_KEY = 'getMemberAuthListQueryKey';

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

export function useGetMenuMemberAuthQuery(params: PMenuMemberAuth) {
  return useQueryWrapper({
    queryKey: [GET_MENU_MEMBER_AUTH_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthApi(params),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:
      params.menuId !== '' &&
      params.menuId !== Router.MAIN.slice(1) &&
      params.menuId !== Router.MY_PROFILE,
  });
}

export function useGetMemberListQuery() {
  return useQueryWrapper({
    queryKey: [GET_MEMBER_LIST_QUERY_KEY],
    queryFn: () => getMemberListApi(),
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

export function useGetMenuMemberAuthListQuery(params: PMenuMemberAuthList) {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY, params],
    queryFn: () => getMenuMemberAuthListApi(params),
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: params.memberId !== '',
  });
}

export function useUpdateMenuMemberAuthMutation() {
  return useMutation({
    mutationFn: (data: RMenuMemberAuth[]) => updateMenuMemberAuthApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
