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
 * - 컬럼필터링
 * - 컬럼 소팅
 * - 하단 페이징 또는 로우수 정보
 *    체크박스 페이징 시 초기화
 *    기타 상태도 초기화
 * - 테이블 크기조절
 * - flex 레이아웃
 * --------------------------------
 * - 컬럼 수정
 * - 컬럼 숨기고 보이기
 * - 컬럼이동
 * - 로우이동
 * - 가로스크롤 속도 최적화
 * */

const defaultTableStyle: TTableStyle = {
  tableMaxHeight: undefined,
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
  tableFooterHeight: 40,
  tableBodyHoverBackgroundColor: '#eaeaea',
};

export function Table<TData extends { index: string } & Record<string, any>>({
  tableHeaders,
  tableDataList,
  tableStyle = {},
  dataKey = 'index',
  filterRowEnabled = false,
}: {
  tableHeaders: THeader[];
  tableDataList: TData[];
  tableStyle?: Partial<TTableStyle>;
  dataKey?: keyof TData;
  filterRowEnabled?: boolean;
}) {
  const applyTableStyle = {
    ...defaultTableStyle,
    ...tableStyle,
  };
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useSyncScroll(headerRef, bodyRef);

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

  const { isChecked, handleCheck, handleCheckAll, checkedState } = useTableChecked({
    dataList: tableDataList,
    dataKey,
  });

  const totalWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0) + 2;
  const headerHeight = filterRowEnabled
    ? applyTableStyle.tableHeaderHeight * 2
    : applyTableStyle.tableHeaderHeight;

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
      className={'table-root selection-none'}
      style={{
        ...{
          position: 'relative',
          height:
            headerHeight +
            applyTableStyle.tableBodyHeight * tableDataList.length +
            applyTableStyle.tableFooterHeight,
          width: totalWidth,
          maxWidth: 'calc(100vw - 300px)',
          border: applyTableStyle.tableBorder,
          borderRadius: applyTableStyle.tableBorderRadius,
          maxHeight:
            applyTableStyle.tableMaxHeight &&
            applyTableStyle.tableMaxHeight + applyTableStyle.tableFooterHeight,
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
        headerHeight={headerHeight}
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
