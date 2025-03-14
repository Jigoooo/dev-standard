import {
  DefaultError,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getToken, setToken, tokenRefreshApi } from '@/entities/auth';
import { dialogActions, DialogType } from 'shared/ui';
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
      if (query.data.code === 401 || query.data.code === 403) {
        // console.clear();

        const token = getToken();

        if (token === null) {
          dialogActions.open({
            dialogType: DialogType.ERROR,
            title: query.data.msg || '세션이 만료되었습니다.',
            contents: '로그인을 다시 진행해 주세요.',
            onConfirm: () => {
              navigate('/', { replace: true });
            },
            overlayClose: false,
          });
        } else {
          tokenRefreshApi(token.refreshToken).then((data) => {
            if (
              !data.success ||
              !data?.data?.accessToken ||
              !data?.data?.refreshToken ||
              !data?.data?.expiresIn
            ) {
              dialogActions.open({
                dialogType: DialogType.ERROR,
                title: query.data.msg || '세션이 만료되었습니다.',
                contents: '로그인을 다시 진행해 주세요.',
                onConfirm: () => {
                  navigate('/', { replace: true });
                },
                overlayClose: false,
              });

              return;
            }

            setToken({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
            });

            return query.refetch();
          });
        }
      } else {
        dialogActions.open({
          dialogType: DialogType.ERROR,
          title: query.data.msg || '오류가 발생하였습니다.',
          contents: '관리자에게 문의해 주세요.',
          overlayClose: false,
        });
      }
    }
  }, [query.data]);

  return query;
}
