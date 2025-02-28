import { FlexRow, THeader, TTableStyle } from '@/shared/components';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBody<TData extends { index: string }>({
  headers,
  dataList,
  tableStyle,
}: {
  headers: THeader[];
  dataList: TData[];
  tableStyle: TTableStyle;
}) {
  const viewHeaders = headers.filter((header) => header.pin === 'view');

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const rightPinHeaders = headers.filter((header) => header.pin === 'right');

  const requiredKeys = headers.map((header) => header.id) as (keyof TData)[];
  if (!validateDataList<TData>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  return (
    <FlexRow
      className={'table-body'}
      style={{
        backgroundColor: tableStyle.tableBodyBackgroundColor,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* 왼쪽 고정 영역 */}
      <TableBodyPin
        tableStyle={tableStyle}
        position={'left'}
        headers={leftPinHeaders}
        dataList={dataList}
      />

      {/* 중앙 영역 */}
      <TableBodyView tableStyle={tableStyle} headers={viewHeaders} dataList={dataList} />

      {/* 오른쪽 고정 영역 */}
      <TableBodyPin
        tableStyle={tableStyle}
        position={'right'}
        headers={rightPinHeaders}
        dataList={dataList}
      />
    </FlexRow>
  );
}

function TableBodyView<TData extends Record<string, any>>({
  tableStyle,
  headers,
  dataList,
}: {
  tableStyle: TTableStyle;
  headers: THeader[];
  dataList: TData[];
}) {
  const viewWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 10,
  });

  return (
    <div
      ref={tableBodyRef}
      className={'table-body-view'}
      style={{
        position: 'relative',
        height: rowVirtualizer.getTotalSize(),
        flexGrow: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div
        className={'table-body-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem, virtualIndex) => {
          const data = dataList[virtualItem.index];
          const index = data['index'];
          const isOdd = virtualIndex % 2 === 0;

          return (
            <div
              key={index}
              className={'table-body-row'}
              style={{
                position: 'absolute',
                transform: 'translateY(' + virtualItem.start + 'px)',
                width: viewWidth,
                height: tableStyle.tableBodyHeight,
                borderBottom:
                  virtualIndex === rowVirtualizer.getTotalSize() - 1
                    ? 'none'
                    : tableStyle.tableBorder,
              }}
            >
              {headers.map((header, headerIndex, array) => {
                const left =
                  headerIndex === 0
                    ? 0
                    : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

                return (
                  <FlexRow
                    key={header.id}
                    className={'table-body-cell'}
                    style={{
                      boxSizing: 'border-box',
                      position: 'absolute',
                      alignItems: 'center',
                      paddingInline: 12,
                      width: header.width,
                      height: tableStyle.tableBodyHeight - 1, // todo 보정해야 하는 이유 찾기
                      left: left,
                      backgroundColor: isOdd
                        ? tableStyle.tableBodyOddBackgroundColor
                        : tableStyle.tableBodyBackgroundColor,
                      contain: 'paint',
                    }}
                  >
                    <TableBodyLabel tableStyle={tableStyle} label={data[header.id]} />
                  </FlexRow>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TableBodyPin<TData extends Record<string, any>>({
  tableStyle,
  position,
  headers,
  dataList,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  headers: THeader[];
  dataList: TData[];
}) {
  const pinHeaderWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 10,
  });

  return (
    <div
      ref={tableBodyRef}
      className={'table-body-pin'}
      style={{
        ...{
          position: 'relative',
          height: rowVirtualizer.getTotalSize(),
          width: pinHeaderWidth,
          minWidth: pinHeaderWidth,
          maxWidth: pinHeaderWidth,
          ...(position === 'left'
            ? { borderRight: tableStyle.tableBorder }
            : { borderLeft: tableStyle.tableBorder }),
        },
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem, virtualIndex) => {
        const data = dataList[virtualItem.index];
        const index = data['index'];
        const isOdd = virtualIndex % 2 === 0;

        return (
          <div
            key={index}
            className={'pin-body-row'}
            style={{
              position: 'absolute',
              transform: 'translateY(' + virtualItem.start + 'px)',
              width: '100%',
              height: tableStyle.tableBodyHeight,

              borderBottom:
                virtualIndex === rowVirtualizer.getTotalSize() - 1
                  ? 'none'
                  : tableStyle.tableBorder,
            }}
          >
            {headers.map((header, headerIndex, array) => {
              const left =
                headerIndex === 0
                  ? 0
                  : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

              return (
                <FlexRow
                  className={'table-body-cell'}
                  key={header.id}
                  style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    alignItems: 'center',
                    paddingInline: 10,
                    left: left,
                    width: header.width - 1, // todo 보정해야 하는 이유 찾기
                    height: '100%',
                    backgroundColor: isOdd
                      ? tableStyle.tableBodyOddBackgroundColor
                      : tableStyle.tableBodyBackgroundColor,
                    contain: 'paint',
                  }}
                >
                  <TableBodyLabel tableStyle={tableStyle} label={data[header.id]} />
                </FlexRow>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function TableBodyLabel({ tableStyle, label }: { tableStyle: TTableStyle; label: string }) {
  return (
    <span style={{ fontSize: '0.88rem', fontWeight: 500, color: tableStyle.tableBodyColor }}>
      {label}
    </span>
  );
}
