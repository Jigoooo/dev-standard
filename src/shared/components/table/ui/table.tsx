import { useRef, useState } from 'react';
import { THeader, TTableStyle } from '@/shared/components';
import { TableHeader } from './table-header.tsx';
import { TableBody } from '@/shared/components/table/ui/table-body.tsx';

const defaultTableStyle: TTableStyle = {
  tableResizeColor: '#cecece',
  tableBorderColor: '#bdc3c7',
  tableBorder: '1px solid #bdc3c7',
  tableBorderRadius: 2,
  tableHeaderHeight: 36,
  tableBodyHeight: 36,
  tableHeaderBackgroundColor: '#f4f4f4',
  tableBodyBackgroundColor: '#ffffff',
  tableBodyOddBackgroundColor: '#fcfdfe',
  tableHeaderColor: 'rgba(0, 0, 0, 0.6)',
  tableBodyColor: 'rgba(0, 0, 0, 1)',
};

export function Table({
  tableStyle = {},
  tableHeaders,
  filterRowEnabled = false,
}: {
  tableStyle?: Partial<TTableStyle>;
  tableHeaders: THeader[];
  filterRowEnabled?: boolean;
}) {
  const applyTableStyle = {
    ...defaultTableStyle,
    ...tableStyle,
  };
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const onHeaderScroll = () => {
    if (headerRef.current && bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const onBodyScroll = () => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const [headers, setHeaders] = useState<THeader[]>(tableHeaders);
  const onChangeFilterValue = (headerId: string, value: string) => {
    setHeaders((prevState) => {
      return prevState.map((header) => {
        if (header.id === headerId) {
          return {
            ...header,
            filter: {
              ...header.filter,
              filterValue: value,
            },
          };
        }
        return header;
      }) as THeader[];
    });
  };

  const [dataList] = useState([
    {
      index: '1',
      name: '2',
      address: '3',
      column0: '4',
      column1: '4',
      column2: '4',
      column3: '4',
      column4: '4',
      column5: '4',
      column6: '4',
      column7: '4',
      column8: '4',
      column9: '4',
      phoneNumber: '4',
      note: '4',
    },
    {
      index: '2',
      name: '3',
      address: '3',
      column0: '4',
      column1: '4',
      column2: '4',
      column3: '4',
      column4: '4',
      column5: '4',
      column6: '4',
      column7: '4',
      column8: '4',
      column9: '4',
      phoneNumber: '4',
      note: '4',
    },
  ]);

  return (
    <div
      className={'table-root selection-none'}
      style={{
        height:
          (filterRowEnabled
            ? applyTableStyle.tableHeaderHeight * 2
            : applyTableStyle.tableHeaderHeight) +
          applyTableStyle.tableBodyHeight * dataList.length,
        width: '100%',
        border: applyTableStyle.tableBorder,
        borderRadius: applyTableStyle.tableBorderRadius,
      }}
    >
      <TableHeader
        ref={headerRef}
        onHeaderScroll={onHeaderScroll}
        tableStyle={applyTableStyle}
        headers={headers}
        filterRowEnabled={filterRowEnabled}
        onChangeFilterValue={onChangeFilterValue}
      />

      <TableBody
        ref={bodyRef}
        onBodyScroll={onBodyScroll}
        tableStyle={applyTableStyle}
        headers={headers}
        dataList={dataList}
      />

      {/*<div className={'table-body'}>*/}
      {/*  <div className={'table-body-left-pin'}></div>*/}
      {/*  <div className={'table-body-view'}>*/}
      {/*    <div className={'table-body-container'}></div>*/}
      {/*  </div>*/}
      {/*  <div className={'table-body-right-pin'}></div>*/}
      {/*</div>*/}
    </div>
  );
}
