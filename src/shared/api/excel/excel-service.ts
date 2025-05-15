import { keepPreviousData, useMutation } from '@tanstack/react-query';

import { excelDeleteApi, excelSaveApi, excelUpdateApi, getExcelsApi } from './excel-api.ts';
import type {
  ExcelDeleteParameter,
  ExcelsParameter,
  ExcelSaveDataParameter,
} from './excel-upload-download-type.ts';
import { loading } from '@/shared/ui';
import { useQueryWrapper } from '../config/use-query-wrapper.ts';

const EXCELS_QUERY_KEY = 'excelInfoListQueryKey';

export function useExcelsQuery(params: ExcelsParameter) {
  return useQueryWrapper(
    {
      queryKey: [EXCELS_QUERY_KEY, params],
      queryFn: () => getExcelsApi(params),
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
    mutationFn: (params: ExcelDeleteParameter) => excelDeleteApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
