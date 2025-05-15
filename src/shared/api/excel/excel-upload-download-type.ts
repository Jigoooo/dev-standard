export type ExcelDataResponse = {
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

export type ExcelsParameter = {
  excelNm?: string;
  fromDate: string;
  toDate: string;
};

export type ExcelInfoResponse = {
  idx: number;
  excelNm: string;
  insDt: string;
  insMember: string;
  updDt: string | null;
  updMember: string | null;
};

export type ExcelInfoListResponse = {
  excelInfoList: ExcelInfoResponse[];
};

export type ExcelDataParameter = {
  idx: number;
};

export type ExcelDataListResponse = {
  excelDataList: ExcelDataResponse[];
};

export type ExcelSaveDataParameter = {
  idx?: number;
  excelNm: string;
  excelDataList: ExcelDataResponse[];
  deleteDataList?: number[];
};

export type ExcelDeleteParameter = {
  deleteExcelList: number[];
};
