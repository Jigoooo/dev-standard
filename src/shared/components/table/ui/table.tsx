import { useRef, useState } from 'react';

import { THeader, TTableStyle } from '@/shared/components';
import { TableHeader } from './table-header.tsx';
import { TableBody } from './table-body.tsx';
import { testData } from './testData.ts';

const defaultTableStyle: TTableStyle = {
  rootTableStyle: {},
  bodyTableStyle: {},
  tableResizeColor: '#cecece',
  tableBorderColor: '#bdc3c7',
  tableBorder: '1px solid #bdc3c7',
  tableBorderRadius: 2,
  tableHeaderHeight: 36,
  tableBodyHeight: 40,
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

  const [dataList] = useState(testData);

  const totalWidth = headers.reduce((acc, cur) => acc + cur.width, 0) + 2;

  return (
    <div
      className={'table-root selection-none'}
      style={{
        ...{
          height:
            (filterRowEnabled
              ? applyTableStyle.tableHeaderHeight * 2
              : applyTableStyle.tableHeaderHeight) +
            applyTableStyle.tableBodyHeight * dataList.length,
          width: totalWidth,
          maxWidth: 'calc(100vw - 300px)',
          border: applyTableStyle.tableBorder,
          borderRadius: applyTableStyle.tableBorderRadius,
        },
        ...applyTableStyle.rootTableStyle,
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
    </div>
  );
}
