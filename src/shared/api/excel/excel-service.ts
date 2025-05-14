import { keepPreviousData, useMutation } from '@tanstack/react-query';

import { excelDeleteApi, excelSaveApi, excelUpdateApi, getExcelInfoListApi } from './excel-api.ts';
import type {
  ExcelDeleteListParameter,
  ExcelInfoListParameter,
  ExcelSaveDataParameter,
} from './excel-upload-download-type.ts';
import { loading } from '@/shared/ui';
import { useQueryWrapper } from '../config/use-query-wrapper.ts';

const EXCEL_INFO_LIST_QUERY_KEY = 'excelInfoListQueryKey';

export function useExcelInfoListQuery(params: ExcelInfoListParameter) {
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
    mutationFn: (data: ExcelSaveDataParameter) => excelSaveApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useUpdateExcelMutation() {
  return useMutation({
    mutationFn: (data: ExcelSaveDataParameter) => excelUpdateApi(data),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}

export function useExcelDeleteMutation() {
  return useMutation({
    mutationFn: (params: ExcelDeleteListParameter) => excelDeleteApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
