import { useMutation } from '@tanstack/react-query';

import { getExcelInfoListApi, saveExcelApi, updateExcelApi } from './excel-api.ts';
import { PExcelInfoList, PSaveExcelData } from '../model/excel-upload-download-type.ts';
import { useQueryWrapper } from '@/entities/query';

const EXCEL_INFO_LIST_QUERY_KEY = 'excelInfoListQueryKey';

export function useExcelInfoListQuery(params: PExcelInfoList = {}) {
  return useQueryWrapper({
    queryKey: [EXCEL_INFO_LIST_QUERY_KEY, params],
    queryFn: () => getExcelInfoListApi(params),
  });
}

export function useSaveExcelMutation() {
  return useMutation({
    mutationFn: (data: PSaveExcelData) => saveExcelApi(data),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}

export function useUpdateExcelMutation() {
  return useMutation({
    mutationFn: (data: PSaveExcelData) => updateExcelApi(data),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
