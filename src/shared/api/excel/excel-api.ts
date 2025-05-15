import { apiRequest, customedAxios } from '../config';
import type {
  ExcelDataParameter,
  ExcelDeleteParameter,
  ExcelsParameter,
  ExcelSaveDataParameter,
  ExcelDataListResponse,
  ExcelInfoListResponse,
} from './excel-upload-download-type.ts';

export async function getExcelsApi(params: ExcelsParameter) {
  return await apiRequest<ExcelInfoListResponse>(
    customedAxios.get('/v1/excels', {
      params,
    }),
  );
}

export async function getExcelDataApi(params: ExcelDataParameter) {
  return await apiRequest<ExcelDataListResponse>(
    customedAxios.get(`/v1/excels/${params.idx}/data`),
  );
}

export async function excelSaveApi(data: ExcelSaveDataParameter) {
  return await apiRequest<null>(customedAxios.post('/v1/excels', data));
}

export async function excelUpdateApi(data: ExcelSaveDataParameter) {
  return await apiRequest<null>(customedAxios.put('/v1/excels', data));
}

export async function excelDeleteApi(params: ExcelDeleteParameter) {
  return await apiRequest<null>(
    customedAxios.delete('/v1/excels', {
      params,
    }),
  );
}
