import { apiRequest, customedAxios } from '@/shared/api';
import { RToken } from '@/entities/auth';
import { PRegisterExcelData } from '../model/excel-upload-download-type.ts';

export async function registerExcelApi(data: PRegisterExcelData) {
  return await apiRequest<RToken>(customedAxios.post('/excel/save', data));
}
