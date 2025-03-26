import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import { getMenuListApi, updateMenuApi } from './menu-api.ts';
import { RMenu } from '@/shared/api';
import { loading } from '@/shared/ui';

const GET_MENU_LIST_QUERY_KEY = 'getMenuListQueryKey';

export function useGetMenuListQuery() {
  return useQueryWrapper({
    queryKey: [GET_MENU_LIST_QUERY_KEY],
    queryFn: () => getMenuListApi(),
  });
}

export function useUpdateMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RMenu[]) => updateMenuApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MENU_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
