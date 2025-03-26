import {
  DefaultError,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdapterResponseType, handleAuthError } from '@/shared/api';
import { loading } from '@/shared/ui';

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
  {
    withLoading,
    loadingText,
    onOtherError,
  }: {
    withLoading?: boolean;
    loadingText?: string;
    onOtherError?: () => void;
  } = {},
): UseQueryResult<AdapterResponseType<TData>, TError> {
  const navigate = useNavigate();
  const query = useQuery(options);

  useEffect(() => {
    if (query.data && !query.data.success) {
      handleAuthError({
        data: query.data,
        onUnauthenticated: () => navigate('/', { replace: true }),
        onOtherError,
        onRefreshSuccess: () => query.refetch(),
      });
    }
  }, [query.data]);

  useEffect(() => {
    if (withLoading) {
      if (query.isLoading) {
        loading.debounceShow({
          loadingText,
        });
      } else {
        loading.hide();
      }
    }
  }, [query.isFetching]);

  return query;
}
