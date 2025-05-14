import { saveAs } from 'file-saver';

import { apiRequest, customedAxios } from '../config';
import type {
  DeleteFileListParameter,
  FileDownloadParameter,
  FileListItemParameter,
  FileSaveListParameter,
  FileListResponse,
} from './file-upload-download-type.ts';

export async function getFileListApi(params: FileListItemParameter) {
  return await apiRequest<FileListResponse>(
    customedAxios.get('/v1/files', {
      params,
    }),
  );
}

export async function downloadFileApi(params: FileDownloadParameter) {
  const response = await customedAxios.get(`/v1/files/${params.fileIdx}/download`, {
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

export async function fileSaveApi(data: FileSaveListParameter) {
  const formData = new FormData();
  data.fileList.forEach((file) => {
    formData.append('fileList', file);
  });

  return await apiRequest<null>(
    customedAxios.post('/v1/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export async function deleteFileApi(params: DeleteFileListParameter) {
  return await apiRequest<null>(customedAxios.delete('/v1/files/info', { params }));
}
