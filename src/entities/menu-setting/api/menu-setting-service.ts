import { useQueryWrapper } from '@/entities/query';
import { getMenuListApi, updateMenuApi } from './menu-setting-api.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RMenu } from '@/entities/router';

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
  });
}
