import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PSaveExcelData) => saveExcelApi(data),
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCEL_INFO_LIST_QUERY_KEY],
      });
    },
    onError: () => {},
    onSettled: () => {},
  });
}

export function useUpdateExcelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PSaveExcelData) => updateExcelApi(data),
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCEL_INFO_LIST_QUERY_KEY],
      });
    },
    onError: () => {},
    onSettled: () => {},
  });
}
