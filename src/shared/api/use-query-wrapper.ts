import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryClient,
  DefaultError,
  QueryKey,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { AdapterResponseType } from '@/shared/api/response-adapter.ts';
import { getToken } from '@/entities/auth';
import { dialogActions } from '@/shared/components';
import { useNavigate } from 'react-router-dom';

export function useQueryWrapper<
  TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<
    AdapterResponseType<TData>,
    TError,
    AdapterResponseType<TData>,
    TQueryKey
  >,
  queryClient?: QueryClient,
): UseQueryResult<AdapterResponseType<TData>, TError> {
  const navigate = useNavigate();

  const query = useQuery(options, queryClient);

  useEffect(() => {
    if (query.data && !query.data.success) {
      if (query.data.code === 401 || query.data.code === 403) {
        const token = getToken();
        if (token === null) {
          dialogActions.openDialog({
            title: query.data.msg || '토큰이 만료되었습니다.',
            contents: '로그인을 다시 진행해 주세요.',
            onConfirm: () => {
              navigate('/', { replace: true });
            },
            overlayClose: false,
          });
        }
      }
    }
  }, [query.data]);

  return query;
}
