import { RefObject, useEffect, useRef, useState } from 'react';

import {
  FlexRow,
  THeader,
  TTableStyle,
  useTableChecked,
  useTableSorting,
} from '@/shared/components';
import { TableHeader } from './table-header.tsx';
import { TableBody } from './table-body.tsx';

/*
 * todo
 * - 로우 수 변화 시 스크롤 위치 조절
 * - 하단 페이징 또는 로우수 정보
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

export function Table<TData extends { index: string } & Record<string, any>>({
  tableHeaders,
  tableDataList,
  handelDataList,
  handleSyncCheckList,
  tableStyle = {},
  dataKey = 'index',
  filterRowEnabled = false,
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

  const [tableHeight, setTableHeight] = useState(0);
  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.clientHeight);
    }
  }, []);

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
      <TableHeader
        ref={headerRef}
        tableStyle={applyTableStyle}
        headers={sortedHeaders}
        filterRowEnabled={filterRowEnabled}
        onChangeFilterValue={onChangeFilterValue}
        checkedState={checkedState}
        handleCheckAll={handleCheckAll}
        handleSort={handleSort}
      />

      <TableBody
        ref={bodyRef}
        tableStyle={applyTableStyle}
        headers={headers}
        dataList={sortedDataList}
        handelDataList={handelDataList}
        bodyMaxHeight={bodyMaxHeight}
        isChecked={isChecked}
        handleCheck={handleCheck}
      />

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
        <span style={{ fontSize: '0.86rem', color: '#999999', fontWeight: 500 }}>
          Rows:{' '}
          {filteredDataList.length !== tableDataList.length && (
            <>
              <span style={{ color: '#000000', fontWeight: 500 }}>{filteredDataList.length}</span>
              &nbsp;
              <span style={{ color: '#000000', fontWeight: 500 }}>of</span>
              &nbsp;
            </>
          )}
          <span style={{ fontSize: '0.86rem', color: '#000000', fontWeight: 500 }}>
            {tableDataList.length}
          </span>
        </span>
      </FlexRow>
    </div>
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

    let isSyncingHeader = false;
    let isSyncingBody = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const onBodyScroll = () => {
      if (isSyncingBody) return;
      isSyncingHeader = true;
      requestAnimationFrame(() => {
        headerEl.scrollLeft = bodyEl.scrollLeft;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          isSyncingHeader = false;
        }, 300);
      });
    };

    const onHeaderScroll = () => {
      if (isSyncingHeader) return;
      isSyncingBody = true;
      requestAnimationFrame(() => {
        bodyEl.scrollLeft = headerEl.scrollLeft;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          isSyncingBody = false;
        }, 300);
      });
    };

    bodyEl.addEventListener('scroll', onBodyScroll);
    headerEl.addEventListener('scroll', onHeaderScroll);

    return () => {
      bodyEl.removeEventListener('scroll', onBodyScroll);
      headerEl.removeEventListener('scroll', onHeaderScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [headerRef, bodyRef]);
}
