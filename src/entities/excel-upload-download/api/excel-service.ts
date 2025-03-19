import { useMutation, useQueryClient } from '@tanstack/react-query';

import { excelSaveApi, excelUpdateApi, getExcelInfoListApi } from './excel-api.ts';
import { PExcelInfoList, PExcelSaveData } from '../model/excel-upload-download-type.ts';
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
    mutationFn: (data: PExcelSaveData) => excelSaveApi(data),
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
    mutationFn: (data: PExcelSaveData) => excelUpdateApi(data),
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
