import { useMutation } from '@tanstack/react-query';
import { saveExcelApi, updateExcelApi } from '@/entities/excel-upload-download/api/excel-api.ts';
import { PSaveExcelData } from '@/entities/excel-upload-download/model/excel-upload-download-type.ts';

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
