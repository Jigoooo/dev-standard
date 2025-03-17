import { TDataWithIndex } from 'shared/ui';

export type RFileDownload = {
  fileUploadTitle: string;
  note: string;
  uploadDateTime: string;
  uploadUser: string;
};

export type TFileDownload = TDataWithIndex & RFileDownload;

export type RExcelData = {
  rowIdx?: number;
  orderNo: string;
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  orderDate: string;
  customerName: string;
  status: string;
};

export type PRegisterExcelData = {
  idx?: number;
  excelNm: string;
  excelDataList: RExcelData[];
  deleteDataList?: number[];
};
