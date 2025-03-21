import { useQueryWrapper } from '@/entities/query';
import { getFileListApi } from '@/entities/file-upload-download/api/file-api.ts';
import { PFileListItem } from '@/entities/file-upload-download/model/file-upload-download-type.ts';

const GET_FILE_LIST_QUERY_KEY = 'getFileListQueryKey';

export function useGetFileList(params: PFileListItem = {}) {
  return useQueryWrapper({
    queryKey: [GET_FILE_LIST_QUERY_KEY, params],
    queryFn: () => getFileListApi(params),
  });
}
