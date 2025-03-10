import { JSX, ReactNode, RefObject } from 'react';

export type TTableContext<TData> = {
  cacheCellRef: RefObject<Map<string, { data: any; element: JSX.Element }>>;
  tableStyle: TTableStyle;
  bodyYRef: RefObject<HTMLDivElement | null>;
  viewportWidth: number;
  bodyMaxHeight: number;
  headerHeight: number;
  headerGroups: THeaderGroup<TData>[];
  headers: THeader<TData>[];
  sortedHeaders: THeader<TData>[];
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

export type THeaderGroup<TData> = {
  groupLabel: string;
  headerIds: (keyof TData)[];
};

export type THeader<TData = Record<string, any>> = {
  id: Extract<keyof TData, string> | 'index' | 'check' | 'button';
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

export type TDataWithIndex = {
  index: string;
};

export type TDataWithCheck = {
  check: boolean;
};

export type TableBodyRowProps = {
  headers: THeader[];
  virtualItem: { index: number; start: number };
  rowWidth: string | number;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  index: string;
};

export type TableBodyCellProps<TData> = {
  rowIndex: number;
  data: TData;
  index: string;
  isOdd: boolean;
  header: THeader;
  hoverIndex: string | null;
};
