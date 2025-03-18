import { TDataWithIndex } from 'shared/ui';

export type RFileDownload = {
  fileUploadTitle: string;
  note: string;
  uploadDateTime: string;
  uploadUser: string;
};

export type TFileDownload = TDataWithIndex & RFileDownload;

export type RExcelDataHeader = {
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

export type RExcelData = {
  rowIdx?: number;
} & RExcelDataHeader;

export type PExcelInfoList = {
  excelNm?: string;
};

export type RExcelInfo = {
  idx: number;
  excelNm: string;
  insDt: string;
  insMember: string;
  updDt: string | null;
  updMember: string | null;
};

export type TExcelInfo = TDataWithIndex & RExcelInfo;

export type RExcelInfoList = {
  excelInfoList: RExcelInfo[];
};

export type PExcelDataList = {
  idx: number;
};

export type RExcelDataList = {
  excelDataList: RExcelData[];
};

export type PSaveExcelData = {
  idx?: number;
  excelNm: string;
  excelDataList: RExcelData[];
  deleteDataList?: number[];
};
