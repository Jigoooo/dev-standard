import { RefObject, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, useScroll, useTransform } from 'framer-motion';

import { FlexRow, THeader, TTableStyle } from '@/shared/components';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBody<TData extends { index: string }>({
  ref,
  onBodyScroll,
  headers,
  dataList,
  tableStyle,
  headerHeight,
}: {
  ref: RefObject<HTMLDivElement | null>;
  onBodyScroll: () => void;
  headers: THeader[];
  dataList: TData[];
  tableStyle: TTableStyle;
  headerHeight: number;
}) {
  const viewHeaders = headers.filter((header) => header.pin === 'view');

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const rightPinHeaders = headers.filter((header) => header.pin === 'right');

  const requiredKeys = headers.map((header) => header.id) as (keyof TData)[];
  if (!validateDataList<TData>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <FlexRow style={{ position: 'relative' }}>
      <FlexRow
        ref={bodyRef}
        className={'table-body no-scrollbar'}
        style={{
          backgroundColor: tableStyle.tableBodyBackgroundColor,
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100%',
          maxHeight: tableStyle.tableMaxHeight
            ? tableStyle.tableMaxHeight - headerHeight
            : undefined,
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
        <TableBodyView
          ref={ref}
          onBodyScroll={onBodyScroll}
          tableStyle={tableStyle}
          headers={viewHeaders}
          dataList={dataList}
        />

        {/* 오른쪽 고정 영역 */}
        <TableBodyPin
          tableStyle={tableStyle}
          position={'right'}
          headers={rightPinHeaders}
          dataList={dataList}
        />
      </FlexRow>
      <CustomVerticalScrollbar
        ref={bodyRef}
        totalContentHeight={tableStyle.tableBodyHeight * dataList.length}
      />
    </FlexRow>
  );
}

function TableBodyView<TData extends Record<string, any>>({
  ref,
  onBodyScroll,
  tableStyle,
  headers,
  dataList,
}: {
  ref: RefObject<HTMLDivElement | null>;
  onBodyScroll: () => void;
  tableStyle: TTableStyle;
  headers: THeader[];
  dataList: TData[];
}) {
  const viewWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => ref.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 10,
  });

  return (
    <div
      ref={ref}
      onScroll={onBodyScroll}
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
        {rowVirtualizer.getVirtualItems().map((virtualItem, virtualIndex, array) => {
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
                borderBottom: virtualIndex === array.length - 1 ? 'none' : tableStyle.tableBorder,
              }}
            >
              {headers.map((header, headerIndex, array) => {
                const left =
                  headerIndex === 0
                    ? 0
                    : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);
                const justifyContent =
                  header.align === 'left'
                    ? 'flex-start'
                    : header.align === 'right'
                      ? 'flex-end'
                      : 'center';

                return (
                  <FlexRow
                    key={header.id}
                    className={'table-body-cell'}
                    style={{
                      boxSizing: 'border-box',
                      position: 'absolute',
                      justifyContent,
                      alignItems: 'center',
                      paddingInline: 12,
                      width: header.width,
                      height: '100%',
                      left: left,
                      backgroundColor:
                        header.id === 'index'
                          ? tableStyle.tableHeaderBackgroundColor
                          : isOdd
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
      {rowVirtualizer.getVirtualItems().map((virtualItem, virtualIndex, array) => {
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
              borderBottom: virtualIndex === array.length - 1 ? 'none' : tableStyle.tableBorder,
            }}
          >
            {headers.map((header, headerIndex, array) => {
              const left =
                headerIndex === 0
                  ? 0
                  : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);
              const justifyContent =
                header.align === 'left'
                  ? 'flex-start'
                  : header.align === 'right'
                    ? 'flex-end'
                    : 'center';

              return (
                <FlexRow
                  className={'table-body-cell'}
                  key={header.id}
                  style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    justifyContent,
                    alignItems: 'center',
                    paddingInline: 10,
                    left: left,
                    width: header.width - 1, // todo 보정해야 하는 이유 찾기
                    // width: header.width,
                    height: '100%',
                    backgroundColor:
                      header.id === 'index'
                        ? tableStyle.tableHeaderBackgroundColor
                        : isOdd
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
    <span
      style={{
        fontSize: '0.88rem',
        fontWeight: 500,
        color: tableStyle.tableBodyColor,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {label}
    </span>
  );
}

type CustomVerticalScrollbarProps = {
  ref: RefObject<HTMLDivElement | null>;
  totalContentHeight: number;
};

export function CustomVerticalScrollbar({ ref, totalContentHeight }: CustomVerticalScrollbarProps) {
  const { scrollYProgress } = useScroll({ container: ref });

  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setContainerHeight(ref.current.clientHeight);
    }
  }, [ref]);

  // thumb 높이 계산: 컨테이너 높이 * (컨테이너 높이 / 컨텐츠 전체 높이)
  const thumbHeight = containerHeight * (containerHeight / totalContentHeight);

  // 스크롤 진행도(scrollYProgress)를 이용해 thumb의 top 위치를 계산합니다.
  // 최대 top 값은 containerHeight - thumbHeight입니다.
  const thumbTop = useTransform(scrollYProgress, [0, 1], [0, containerHeight - thumbHeight]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 16,
        height: containerHeight,
        backgroundColor: 'transparent',
      }}
    >
      <motion.div
        drag='y'
        dragConstraints={{ top: 0, bottom: containerHeight - thumbHeight }}
        onDrag={(_, info) => {
          // thumb 드래그 시 컨테이너의 scrollTop을 업데이트
          if (ref.current) {
            ref.current.scrollTop = (info.point.y / containerHeight) * totalContentHeight;
          }
        }}
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: thumbHeight,
          backgroundColor: '#cccccc',
          borderRadius: 4,
          top: thumbTop,
          cursor: 'pointer',
        }}
      />
    </motion.div>
  );
}
