import type { DataWithIndex } from '@/shared/ui';
import type { ExcelDataResponse, ExcelInfoResponse } from '@/shared/api';

export type ExcelData = DataWithIndex & ExcelDataResponse;

export type ExcelInfo = DataWithIndex & ExcelInfoResponse;
