import { keepPreviousData, useMutation } from '@tanstack/react-query';

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
  return useMutation({
    mutationFn: (data: PExcelSaveData) => excelSaveApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useUpdateExcelMutation() {
  return useMutation({
    mutationFn: (data: PExcelSaveData) => excelUpdateApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useExcelDeleteMutation() {
  return useMutation({
    mutationFn: (params: PExcelDeleteList) => excelDeleteApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
