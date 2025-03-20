import {
  DefaultError,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleAuthError } from '@/entities/auth';
import { AdapterResponseType } from '@/shared/api';

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
): UseQueryResult<AdapterResponseType<TData>, TError> {
  const navigate = useNavigate();
  const query = useQuery(options);

  useEffect(() => {
    if (query.data && !query.data.success) {
      handleAuthError({
        data: query.data,
        onUnauthenticated: () => navigate('/', { replace: true }),
        onRefreshSuccess: () => query.refetch(),
      });
    }
  }, [query.data]);

  return query;
}
