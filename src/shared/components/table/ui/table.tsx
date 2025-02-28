import { useRef, useState } from 'react';

import { FlexRow, THeader, TTableStyle } from '@/shared/components';
import { TableHeader } from './table-header.tsx';
import { TableBody } from './table-body.tsx';

/*
 * todo
 * 1. 컬럼필터링
 * 2. 컬럼이동
 * 3. 로우이동
 * 4. 컬럼 숨기고 보이기
 * 5. 컬럼 소팅
 * 6. 컬럼 수정
 * 7. 체크박스
 * 8. 하단 페이징 또는 로우수 정보
 * 9. 스크롤 컨트롤
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
};

export function Table<TData extends { index: string }>({
  tableStyle = {},
  tableHeaders,
  tableDataList,
  filterRowEnabled = false,
}: {
  tableStyle?: Partial<TTableStyle>;
  tableHeaders: THeader[];
  tableDataList: TData[];
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

  const totalWidth = headers.reduce((acc, cur) => acc + cur.width, 0) + 2;
  const headerHeight = filterRowEnabled
    ? applyTableStyle.tableHeaderHeight * 2
    : applyTableStyle.tableHeaderHeight;

  return (
    <div
      className={'table-root selection-none'}
      style={{
        ...{
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
            applyTableStyle.tableMaxHeight + applyTableStyle.tableFooterHeight + 2, // todo 보정값 원인 찾기
        },
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
        dataList={tableDataList}
        headerHeight={headerHeight}
      />

      <FlexRow
        style={{
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
          <span style={{ fontSize: '0.86rem', color: '#000000', fontWeight: 500 }}>
            {tableDataList.length}
          </span>
        </span>
      </FlexRow>
    </div>
  );
}
