import { apiRequest, customedAxios } from '@/shared/api';
import { PFileListItem, RFileList } from '../model/file-upload-download-type.ts';

export async function getFileListApi(params: PFileListItem) {
  return await apiRequest<RFileList>(
    customedAxios.get('/file/getFileList', {
      params,
    }),
  );
}
