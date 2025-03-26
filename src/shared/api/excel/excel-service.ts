import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';

import { excelDeleteApi, excelSaveApi, excelUpdateApi, getExcelInfoListApi } from './excel-api.ts';
import { PExcelDeleteList, PExcelInfoList, PExcelSaveData } from './excel-upload-download-type.ts';
import { loading } from '@/shared/ui';
import { useQueryWrapper } from '../config/use-query-wrapper.ts';

const EXCEL_INFO_LIST_QUERY_KEY = 'excelInfoListQueryKey';

export function useExcelInfoListQuery(params: PExcelInfoList) {
  return useQueryWrapper(
    {
      queryKey: [EXCEL_INFO_LIST_QUERY_KEY, params],
      queryFn: () => getExcelInfoListApi(params),
      enabled: false,
      placeholderData: keepPreviousData,
    },
    {
      withLoading: true,
    },
  );
}

export function useSaveExcelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PExcelSaveData) => excelSaveApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCEL_INFO_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useUpdateExcelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PExcelSaveData) => excelUpdateApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCEL_INFO_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useExcelDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PExcelDeleteList) => excelDeleteApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCEL_INFO_LIST_QUERY_KEY],
      });
    },
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
