import { saveAs } from 'file-saver';

import { apiRequest, customedAxios } from '../config';
import type {
  DeleteFileParameter,
  FileDownloadParameter,
  FilesParameter,
  FileSaveParameter,
  FilesResponse,
} from './file-upload-download-type.ts';

const FILE_ENDPOINT = '/v1/files';

export async function getFilesApi(params: FilesParameter) {
  return await apiRequest<FilesResponse>(
    customedAxios.get(FILE_ENDPOINT, {
      params,
    }),
  );
}

export async function downloadFileApi(params: FileDownloadParameter) {
  const response = await customedAxios.get(`${FILE_ENDPOINT}/${params.fileIdx}/download`, {
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

export async function fileSaveApi(data: FileSaveParameter) {
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

export async function deleteFileApi(params: DeleteFileParameter) {
  return await apiRequest<null>(customedAxios.delete(`${FILE_ENDPOINT}/info`, { params }));
}
