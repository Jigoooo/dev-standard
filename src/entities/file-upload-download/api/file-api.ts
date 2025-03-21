import { apiRequest, customedAxios } from '@/shared/api';
import { PFileDownload, PFileListItem, RFileList } from '../model/file-upload-download-type.ts';

export async function getFileListApi(params: PFileListItem) {
  return await apiRequest<RFileList>(
    customedAxios.get('/file/getFileList', {
      params,
    }),
  );
}

export async function downloadFileApi(params: PFileDownload) {
  return await apiRequest<RFileList>(
    customedAxios.get('/file/downloadFile', {
      params,
      responseType: 'blob',
    }),
  );
}
