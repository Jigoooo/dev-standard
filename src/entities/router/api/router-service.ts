import { useMutation } from '@tanstack/react-query';
import { getMenuListApi } from './router-api.ts';

export function useGetMenuListService() {
  return useMutation({
    mutationFn: () => getMenuListApi(),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
