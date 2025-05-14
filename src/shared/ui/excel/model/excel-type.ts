import type { DataWithIndex } from '@/shared/ui';
import type { BookType, WritingOptions } from 'xlsx-js-style';
import type XLSX from 'xlsx-js-style';

export type RData<TData extends DataWithIndex> = Omit<TData, 'index'>;

export type TValidationRuleWithHeaderId<TData = Record<string, any>> = {
  id: Extract<keyof TData, string>;
  validateFn: (value: string | number | null) => {
    isValid: boolean;
    errorMessage?: string;
  };
};

type WriteExcelFileDefaultParams = {
  excelFileName: string;
  excelFileExtension?: BookType;
  writingOptions?: WritingOptions;
  sheetName: string;
  headerStyle?: XLSX.CellStyle;
  bodyStyle?: XLSX.CellStyle;
};

export type WriteExcelFileParams<TData> =
  | (WriteExcelFileDefaultParams & {
      rows: TData[];
      rowDataType: 'json';
      jsonToSheetOptions?: XLSX.JSON2SheetOpts;
      aoaToSheetOptions?: never;
    })
  | (WriteExcelFileDefaultParams & {
      rows: TData[][];
      rowDataType: 'array';
      jsonToSheetOptions?: never;
      aoaToSheetOptions?: XLSX.AOA2SheetOpts;
    });
