import { apiRequest, customedAxios } from '@/shared/api';
import { PFileListItem } from '../model/file-upload-download-type.ts';

export async function getFileListApi(params: PFileListItem) {
  return await apiRequest<null>(
    customedAxios.get('/file/getFileList', {
      params,
    }),
  );
}
