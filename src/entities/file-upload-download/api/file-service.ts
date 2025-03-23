import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useQueryWrapper } from '@/entities/query';
import { fileSaveApi, getFileListApi } from './file-api.ts';
import { PFileListItem, PFileSaveList } from '../model/file-upload-download-type.ts';

const GET_FILE_LIST_QUERY_KEY = 'getFileListQueryKey';

export function useGetFileList(params: PFileListItem = {}) {
  return useQueryWrapper({
    queryKey: [GET_FILE_LIST_QUERY_KEY, params],
    queryFn: () => getFileListApi(params),
  });
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
  });
}
