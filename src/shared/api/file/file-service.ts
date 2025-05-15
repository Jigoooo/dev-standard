import { keepPreviousData, useMutation } from '@tanstack/react-query';

import { useQueryWrapper } from '../config/use-query-wrapper.ts';
import { deleteFileApi, fileSaveApi, getFilesApi } from './file-api.ts';
import type {
  DeleteFileParameter,
  FilesParameter,
  FileSaveParameter,
} from './file-upload-download-type.ts';
import { loading } from '@/shared/ui';

const GET_FILES_QUERY_KEY = 'getFilesQueryKey';

export function useGetFilesQuery(params: FilesParameter) {
  return useQueryWrapper(
    {
      queryKey: [GET_FILES_QUERY_KEY, params],
      queryFn: () => getFilesApi(params),
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
    mutationFn: (data: FileSaveParameter) => fileSaveApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useDeleteFileMutation() {
  return useMutation({
    mutationFn: (params: DeleteFileParameter) => deleteFileApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
