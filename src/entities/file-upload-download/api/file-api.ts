import { saveAs } from 'file-saver';

import { apiRequest, customedAxios } from '@/shared/api';
import {
  PFileDownload,
  PFileListItem,
  PFileSaveList,
  RFileList,
} from '../model/file-upload-download-type.ts';

export async function getFileListApi(params: PFileListItem) {
  return await apiRequest<RFileList>(
    customedAxios.get('/file/getFileList', {
      params,
    }),
  );
}

export async function downloadFileApi(params: PFileDownload) {
  const response = await customedAxios.get('/file/downloadFile', {
    params,
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'];
  let fileName = 'downloaded_file';
  if (disposition && disposition.indexOf('filename') !== -1) {
    const filenameRegex = /filename\*=UTF-8''(.+)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
    }
  }

  saveAs(response.data, fileName);

  return response;
}

export async function fileSaveApi(data: PFileSaveList) {
  const formData = new FormData();
  data.fileList.forEach((file) => {
    formData.append('fileList', file);
  });

  return await apiRequest<null>(
    customedAxios.post('/file/fileSave', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}
