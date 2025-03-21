import { useQueryWrapper } from '@/entities/query';
import { downloadFileApi, getFileListApi } from '@/entities/file-upload-download/api/file-api.ts';
import {
  PFileDownload,
  PFileListItem,
} from '@/entities/file-upload-download/model/file-upload-download-type.ts';

const GET_FILE_LIST_QUERY_KEY = 'getFileListQueryKey';
const GET_FILE_DOWNLOAD_QUERY_KEY = 'getFileDownloadQueryKey';

export function useGetFileList(params: PFileListItem = {}) {
  return useQueryWrapper({
    queryKey: [GET_FILE_LIST_QUERY_KEY, params],
    queryFn: () => getFileListApi(params),
  });
}

export function useFileDownload(params: PFileDownload) {
  return useQueryWrapper({
    queryKey: [GET_FILE_DOWNLOAD_QUERY_KEY, params],
    queryFn: () => downloadFileApi(params),
    enabled: true,
  });
}
