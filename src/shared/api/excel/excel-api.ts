import { apiRequest, customedAxios, handleAuthError } from '../config';
import {
  PExcelDataList,
  PExcelDeleteList,
  PExcelInfoList,
  PExcelSaveData,
  RExcelDataList,
  RExcelInfoList,
} from './excel-upload-download-type.ts';

export async function getExcelInfoListApi(params: PExcelInfoList) {
  return await apiRequest<RExcelInfoList>(
    customedAxios.get('/v1/excels', {
      params,
    }),
  );
}

export async function getExcelDataListApi(params: PExcelDataList) {
  let response = await apiRequest<RExcelDataList>(
    customedAxios.get(`/v1/excels/${params.idx}/data`),
  );

  const isError = await handleAuthError({
    data: response,
    onUnauthenticated: () => window.location.replace('/'),
    onRefreshSuccess: () => {},
  });

  if (isError) {
    response = await getExcelDataListApi({
      idx: params.idx,
    });
  }

  return response;
}

export async function excelSaveApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.post('/v1/excels', data));
}

export async function excelUpdateApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.put('/v1/excels', data));
}

export async function excelDeleteApi(params: PExcelDeleteList) {
  return await apiRequest<null>(
    customedAxios.delete('/v1/excels', {
      params,
    }),
  );
}
