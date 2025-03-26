import { saveAs } from 'file-saver';

import { apiRequest, customedAxios } from '../config';
import {
  PDeleteFileList,
  PFileDownload,
  PFileListItem,
  PFileSaveList,
  RFileList,
} from './file-upload-download-type.ts';

export async function getFileListApi(params: PFileListItem) {
  return await apiRequest<RFileList>(
    customedAxios.get('/v1/file/info', {
      params,
    }),
  );
}

export async function downloadFileApi(params: PFileDownload) {
  const response = await customedAxios.get(`/v1/file/info/${params.fileIdx}/download`, {
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
    customedAxios.post('/v1/file/info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export async function deleteFileApi(data: PDeleteFileList) {
  return await apiRequest<null>(customedAxios.post('/v1/file/info', data));
}
