import { apiRequest, customedAxios } from '@/shared/api';
import {
  PExcelDataList,
  PExcelInfoList,
  PExcelSaveData,
  RExcelDataList,
  RExcelInfoList,
} from '../model/excel-upload-download-type.ts';

export async function getExcelInfoListApi(params: PExcelInfoList) {
  return await apiRequest<RExcelInfoList>(
    customedAxios.get('/excel/getExcelInfoList', {
      params,
    }),
  );
}

export async function getExcelDataListApi(params: PExcelDataList) {
  return await apiRequest<RExcelDataList>(
    customedAxios.get('/excel/getExcelDataList', {
      params,
    }),
  );
}

export async function excelSaveApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.post('/excel/excelSave', data));
}

export async function excelUpdateApi(data: PExcelSaveData) {
  return await apiRequest<null>(customedAxios.post('/excel/excelUpdate', data));
}
