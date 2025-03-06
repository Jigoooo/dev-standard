import { createContext, RefObject, Usable, use, useEffect, useRef, useState } from 'react';

import {
  FlexRow,
  TTableContext,
  THeader,
  TTableStyle,
  useTableChecked,
  useTableSorting,
  Typography,
} from '@/shared/components';
import { TableHeader } from './table-header.tsx';
import { TableBody } from './table-body.tsx';
import { useElementHeight } from '@/shared/hooks';

/*
 * todo
 * - 하단 페이징
 *    체크박스 페이징 시 초기화
 *    기타 상태도 초기화
 * - flex 레이아웃
 * --------------------------------
 * - 컬럼 수정
 * - 컬럼 숨기고 보이기
 * - 컬럼이동
 * - 로우이동
 * - 가로스크롤 속도 최적화
 * */

const defaultTableStyle: TTableStyle = {
  tableResizeColor: '#cecece',
  tableBorderColor: '#bdc3c7',
  tableBorder: '1px solid #bdc3c7',
  tableBorderRadius: 2,
  tableHeaderHeight: 36,
  tableBodyHeight: 40,
  tableHeaderBackgroundColor: '#efefef',
  tableBodyBackgroundColor: '#ffffff',
  tableBodyOddBackgroundColor: '#f9f9f9',
  tableHeaderColor: 'rgba(0, 0, 0, 0.7)',
  tableBodyColor: 'rgba(0, 0, 0, 1)',
  tableFooterHeight: 40,
  tableBodyHoverBackgroundColor: '#eaeaea',
};

const TableContext = createContext<TTableContext<any> | null>(null);
export const useTableContext = <T extends Record<string, any>>() => {
  const tableContext = use(TableContext as Usable<TTableContext<T>>);

  if (tableContext === null) {
    throw new Error('Table context is null. Please check the Table context ');
  }

  return tableContext;
};

export function Table<TData extends { index: string } & Record<string, any>>({
  tableHeaders,
  tableDataList,
  handelDataList,
  handleSyncCheckList,
  tableStyle = {},
  dataKey = 'index',
  filterRowEnabled = true,
}: {
  tableHeaders: THeader[];
  tableDataList: TData[];
  handelDataList: (index: string, key: string, value: any) => void;
  handleSyncCheckList?: (checkedList: string[]) => void;
  tableStyle?: Partial<TTableStyle>;
  dataKey?: keyof TData;
  filterRowEnabled?: boolean;
}) {
  const applyTableStyle = {
    ...defaultTableStyle,
    ...tableStyle,
  };
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useSyncScroll(headerRef, bodyRef);

  const tableHeight = useElementHeight(tableRef);

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

  const { checkList, isChecked, handleCheck, handleCheckAll, checkedState } = useTableChecked({
    dataList: tableDataList,
    dataKey,
  });

  useEffect(() => {
    handleSyncCheckList?.(checkList);
  }, [checkList]);

  const totalWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0) + 2;
  const headerHeight = filterRowEnabled
    ? applyTableStyle.tableHeaderHeight * 2
    : applyTableStyle.tableHeaderHeight;

  const bodyMaxHeight = tableHeight - headerHeight - applyTableStyle.tableFooterHeight;

  console.log('tableHeight: ', tableHeight);
  console.log('headerHeight: ', headerHeight);
  console.log('applyTableStyle.tableFooterHeight: ', applyTableStyle.tableFooterHeight);
  console.log('bodyMaxHeight: ', bodyMaxHeight);

  const filteredDataList = filterRowEnabled
    ? tableDataList.filter((data) => {
        return headers.every((header) => {
          const filterValue = header.filter?.filterValue || '';

          if (filterValue === '') return true;
          const cellValue = String(data[header.id]).toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      })
    : tableDataList;

  const { sortedHeaders, sortedDataList, handleSort } = useTableSorting({
    headers,
    dataList: filteredDataList,
  });

  return (
    <TableContext
      value={{
        tableStyle: applyTableStyle,
        bodyMaxHeight,
        headers,
        sortedHeaders,
        dataList: sortedDataList,
        handelDataList,
        filterRowEnabled,
        onChangeFilterValue,
        isChecked,
        checkedState,
        handleCheckAll,
        handleCheck,
        handleSort,
      }}
    >
      <div
        ref={tableRef}
        className={'table-root selection-none'}
        style={{
          ...{
            position: 'relative',
            height: '100%',
            maxWidth: totalWidth,
            border: applyTableStyle.tableBorder,
            borderRadius: applyTableStyle.tableBorderRadius,
            overflow: 'hidden',
          },
        }}
      >
        <TableHeader ref={headerRef} />

        <TableBody ref={bodyRef} />

        <FlexRow
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: applyTableStyle.tableFooterHeight,
            backgroundColor: '#ffffff',
            borderTop: applyTableStyle.tableBorder,
            alignItems: 'center',
            paddingLeft: 12,
          }}
        >
          <Typography style={{ fontSize: '0.86rem', color: '#999999', fontWeight: 500 }}>
            Rows:{' '}
            {filteredDataList.length !== tableDataList.length && (
              <>
                <Typography style={{ color: '#000000', fontWeight: 500 }}>
                  {filteredDataList.length}
                </Typography>
                &nbsp;
                <Typography style={{ color: '#000000', fontWeight: 500 }}>of</Typography>
                &nbsp;
              </>
            )}
            <Typography style={{ fontSize: '0.86rem', color: '#000000', fontWeight: 500 }}>
              {tableDataList.length}
            </Typography>
          </Typography>
        </FlexRow>
      </div>
    </TableContext>
  );
}

function useSyncScroll(
  headerRef: RefObject<HTMLDivElement | null>,
  bodyRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const headerEl = headerRef.current;
    const bodyEl = bodyRef.current;
    if (!headerEl || !bodyEl) return;

    const onBodyScroll = () => {
      headerEl.scrollLeft = bodyEl.scrollLeft;
    };

    const onHeaderScroll = () => {
      bodyEl.scrollLeft = headerEl.scrollLeft;
    };

    bodyEl.addEventListener('scroll', onBodyScroll);
    headerEl.addEventListener('scroll', onHeaderScroll);

    return () => {
      bodyEl.removeEventListener('scroll', onBodyScroll);
      headerEl.removeEventListener('scroll', onHeaderScroll);
    };
  }, [headerRef, bodyRef]);
}
