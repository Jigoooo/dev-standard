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

export type PExcelInfoList = {
  excelNm?: string;
  fromDate: string;
  toDate: string;
};

export type RExcelInfo = {
  idx: number;
  excelNm: string;
  insDt: string;
  insMember: string;
  updDt: string | null;
  updMember: string | null;
};

export type RExcelInfoList = {
  excelInfoList: RExcelInfo[];
};

export type PExcelDataList = {
  idx: number;
};

export type RExcelDataList = {
  excelDataList: RExcelData[];
};

export type PExcelSaveData = {
  idx?: number;
  excelNm: string;
  excelDataList: RExcelData[];
  deleteDataList?: number[];
};

export type PExcelDeleteList = {
  deleteExcelList: number[];
};
