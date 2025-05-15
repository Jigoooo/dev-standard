import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import { getMenusApi, updateMenuApi } from './menu-api.ts';
import type { MenuResponse } from '@/shared/api';
import { loading } from '@/shared/ui';

const GET_MENUS_QUERY_KEY = 'getMenusQueryKey';

export function useGetMenusQuery() {
  return useQueryWrapper({
    queryKey: [GET_MENUS_QUERY_KEY],
    queryFn: () => getMenusApi(),
  });
}

export function useUpdateMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MenuResponse[]) => updateMenuApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MENUS_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
