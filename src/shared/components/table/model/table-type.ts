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
};

export type THeader = {
  id: string;
  label: string;
  width: number;
  pin: 'view' | 'left' | 'right';
  align: 'left' | 'center' | 'right';
  filter?: {
    filterType: 'text' | 'select';
    filterValue: string;
  };
};
