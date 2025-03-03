import { ReactNode } from 'react';

export type TTableStyle = {
  tableMaxHeight?: number;
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
  customCell?: (cellData: any, rowData: Record<string, any>) => ReactNode;
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
