import { keepPreviousData, useMutation } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import { deleteFileApi, fileSaveApi, getFileListApi } from './file-api.ts';
import type {
  DeleteFileListParameter,
  FileListItemParameter,
  FileSaveListParameter,
} from './file-upload-download-type.ts';
import { loading } from '@/shared/ui';

const GET_FILE_LIST_QUERY_KEY = 'getFileListQueryKey';

export function useGetFileListQuery(params: FileListItemParameter) {
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
  return useMutation({
    mutationFn: (data: FileSaveListParameter) => fileSaveApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useDeleteFileMutation() {
  return useMutation({
    mutationFn: (params: DeleteFileListParameter) => deleteFileApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
