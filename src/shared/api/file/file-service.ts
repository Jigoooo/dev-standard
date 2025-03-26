import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '@/entities/query';
import { deleteFileApi, fileSaveApi, getFileListApi } from './file-api.ts';
import { PDeleteFileList, PFileListItem, PFileSaveList } from './file-upload-download-type.ts';
import { loading } from '@/shared/ui';

const GET_FILE_LIST_QUERY_KEY = 'getFileListQueryKey';

export function useGetFileListQuery(params: PFileListItem) {
  return useQueryWrapper(
    {
      queryKey: [GET_FILE_LIST_QUERY_KEY, params],
      queryFn: () => getFileListApi(params),
      placeholderData: keepPreviousData,
      enabled: false,
    },
    {
      withLoading: true,
    },
  );
}

export function useFileSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PFileSaveList) => fileSaveApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_FILE_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useDeleteFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PDeleteFileList) => deleteFileApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_FILE_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
