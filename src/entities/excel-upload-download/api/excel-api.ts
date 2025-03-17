import { apiRequest, customedAxios } from '@/shared/api';
import {
  PExcelDataList,
  PExcelInfoList,
  PSaveExcelData,
} from '../model/excel-upload-download-type.ts';

export async function getExcelInfoListApi(params: PExcelInfoList) {
  return await apiRequest<any>(
    customedAxios.get('/excel/getExcelInfoList', {
      params,
    }),
  );
}

export async function getExcelDataListApi(params: PExcelDataList) {
  return await apiRequest<any>(
    customedAxios.get('/excel/getExcelDataList', {
      params,
    }),
  );
}

export async function saveExcelApi(data: PSaveExcelData) {
  return await apiRequest<null>(customedAxios.post('/excel/save', data));
}

export async function updateExcelApi(data: PSaveExcelData) {
  return await apiRequest<null>(customedAxios.post('/excel/update', data));
}
