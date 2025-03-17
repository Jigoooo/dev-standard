import { useMutation } from '@tanstack/react-query';
import { registerExcelApi } from '@/entities/excel-upload-download/api/excel-api.ts';
import { PRegisterExcelData } from '@/entities/excel-upload-download/model/excel-upload-download-type.ts';

export function useRegisterExcelMutation() {
  return useMutation({
    mutationFn: (data: PRegisterExcelData) => registerExcelApi(data),
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });
}
