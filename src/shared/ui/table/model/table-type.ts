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
  dataList: (TData & TDataWithIndex)[];
  handelDataList: (index: string, key: string, value: any) => void;
  deleteDataList: (index: string) => void;
  editMode: boolean;
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
  tableRowClick?: (data: TData) => void;
};

export type TTableStyle = {
  tableContainerAutoWidth: boolean;
  showVerticalLines: boolean;
  tableResizeColor: string;
  tableBorderColor: string;
  tableBorder: string;
  tableFixedBorder: string;
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
    handleRowData,
    deleteRow,
    tableStyle,
  }: {
    cellData: any;
    rowData: TData;
    handleRowData: (key: keyof TData, value: any) => void;
    deleteRow: () => void;
    setCellData: (value: any) => void;
    tableStyle: TTableStyle;
  }) => ReactNode;
  editCell?: ({
    inputRef,
    cellData,
    rowData,
    setCellData,
    handleRowData,
    tableStyle,
    exitEditMode,
  }: {
    inputRef: RefObject<HTMLInputElement | null>;
    cellData: any;
    rowData: TData;
    handleRowData: (key: keyof TData, value: any) => void;
    setCellData: (value: any) => void;
    tableStyle: TTableStyle;
    exitEditMode: () => void;
  }) => ReactNode;
  formatter?: ({ cellData, rowData }: { cellData: any; rowData: TData }) => string | number;
  pin: 'view' | 'left' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  dataAlign: 'left' | 'center' | 'right';
  sorter: {
    sortable: boolean;
    direction?: 'asc' | 'desc' | null;
  };
  filter?: {
    filterType: 'text' | 'select';
    filterCondition?: (filterValue: string) => boolean;
    filterValue: string;
  };
  // validateEdit?: (value: any) => boolean;
};

export type TDataWithIndex = {
  index: string;
};

export type TDataWithCheck = {
  check: boolean;
};

export type TDataWithIndexCheck = TDataWithIndex & TDataWithCheck;

export type TableBodyRowProps = {
  headers: THeader[];
  virtualItem: { index: number; start: number };
  rowWidth: string | number;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  index: string;
  rowClickIndex: string | null;
  setRowClickIndex: (index: string | null) => void;
};
