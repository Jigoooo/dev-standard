import { PaginationState } from '@tanstack/table-core';
import { VisibilityState } from '@tanstack/react-table';

export type ColumnValueFunction<T> = (row: T) => string;

export type TableColumnConfig<TColumnData> = {
  [key in keyof Partial<TColumnData>]: {
    header: string;
    size: number;
    customRender?: (row: TColumnData) => string;
  };
};

export interface UseTableInstanceProps<TColumnData> {
  data: TColumnData[];
  columnConfig: TableColumnConfig<TColumnData>;
  pageCount?: number;
  paginationOptions: PaginationState;
  onPaginationChange: (newState: any) => void;
  columnVisibility?: VisibilityState;
  otherColumnWidth?: number;
}

export type TTableHeader = {
  id: string;
  label: string;
  width?: number;
  fixed?: boolean;
  hidden?: boolean;
  filter: {
    filterable: boolean;
    filterValues: (string | number)[];
  };
  sorter: {
    sortable: boolean;
    direction: 'asc' | 'desc' | null;
  };
};

export type TTablePagination = {
  currentPage: number;
  pageSize: number;
};

export type TTableContext<T> = {
  headers: TTableHeader[];
  dataList: T[];
  handleSort: (key: string) => void;
  visibleCheckbox: boolean;
  visibleIndex: boolean;
  fixed: boolean;
  pagination: TTablePagination;
};
