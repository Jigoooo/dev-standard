import { TDataWithIndex } from '@/shared/ui';
import XLSX, { BookType, WritingOptions } from 'xlsx-js-style';

export type RData<TData extends TDataWithIndex> = Omit<TData, 'index'>;

export type TValidationRuleWithHeaderId<TData = Record<string, any>> = {
  id: Extract<keyof TData, string>;
  validateFn: (value: string | number | null) => {
    isValid: boolean;
    errorMessage?: string;
  };
};

type WriteExcelFileDefaultParams<TData> = {
  excelFileName: string;
  excelFileExtension?: BookType;
  writingOptions?: WritingOptions;
  sheetName: string;
  rows: TData[];
  headerStyle?: XLSX.CellStyle;
  bodyStyle?: XLSX.CellStyle;
};

export type WriteExcelFileParams<TData> =
  | (WriteExcelFileDefaultParams<TData> & {
      rowDataType: 'json';
      jsonToSheetOptions?: XLSX.JSON2SheetOpts;
      aoaToSheetOptions?: never;
    })
  | (WriteExcelFileDefaultParams<TData> & {
      rowDataType: 'array';
      jsonToSheetOptions?: never;
      aoaToSheetOptions?: XLSX.AOA2SheetOpts;
    });
