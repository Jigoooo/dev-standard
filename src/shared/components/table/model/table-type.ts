import { JSX, ReactNode, RefObject } from 'react';

export type TTableContext<TData> = {
  cacheCellRef: RefObject<Map<string, { data: any; element: JSX.Element }>>;
  tableStyle: TTableStyle;
  bodyMaxHeight: number;
  headers: THeader[];
  sortedHeaders: THeader[];
  dataList: (TData & { index: string })[];
  handelDataList: (index: string, key: string, value: any) => void;
  filterRowEnabled: boolean;
  onChangeFilterValue: (headerId: string, value: string) => void;
  isChecked: (data: TData) => boolean;
  checkedState: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheck: (data: TData) => void;
  handleCheckAll: () => void;
  handleSort: (key: string) => void;
};

export type TTableStyle = {
  tableResizeColor: string;
  tableBorderColor: string;
  tableBorder: string;
  tableBorderRadius: number;
  tableHeaderHeight: number;
  tableBodyHeight: number;
  tableHeaderBackgroundColor: string;
  tableBodyBackgroundColor: string;
  tableBodyOddBackgroundColor: string;
  tableHeaderColor: string;
  tableBodyColor: string;
  tableFooterHeight: number;
  tableBodyHoverBackgroundColor: string;
};

export type THeader = {
  id: string;
  label: string;
  width: number;
  cell?: ({
    cellData,
    rowData,
    setCellData,
  }: {
    cellData: any;
    rowData: Record<string, any>;
    setCellData: (value: any) => void;
  }) => ReactNode;
  pin: 'view' | 'left' | 'right';
  align: 'left' | 'center' | 'right';
  sorter: {
    sortable: boolean;
    direction?: 'asc' | 'desc' | null;
  };
  filter?: {
    filterType: 'text' | 'select';
    filterCondition?: (filterValue: string) => boolean;
    filterValue: string;
  };
};
