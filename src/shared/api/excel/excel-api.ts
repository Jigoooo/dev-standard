import { apiRequest, customedAxios } from '../config';
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
    customedAxios.get('/v1/excel', {
      params,
    }),
  );
}

export async function getExcelDataListApi(params: PExcelDataList) {
  return await apiRequest<RExcelDataList>(customedAxios.get(`/v1/excel/${params.idx}/data`));
}

export async function excelSaveApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.post('/v1/excel', data));
}

export async function excelUpdateApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.put('/v1/excel', data));
}

export async function excelDeleteApi(params: PExcelDeleteList) {
  return await apiRequest<null>(
    customedAxios.delete('/v1/excel', {
      params,
    }),
  );
}
