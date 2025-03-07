import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { VirtualItem } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';

import {
  Checkbox,
  CustomHorizontalScrollbar,
  CustomVerticalScrollbar,
  FlexRow,
  THeader,
  Typography,
  useTableContext,
  useTableScrollToFn,
  useVirtualRow,
  validateTableDataList,
} from '@/shared/components';
import { colors } from '@/shared/constants';

export function TableBody<TData extends { index: string }>({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  'use no memo';

  const { tableStyle, bodyMaxHeight, headers, dataList } = useTableContext();

  const viewHeaders = headers.filter((header) => header.pin === 'view');
  const viewHeight = tableStyle.tableBodyHeight * dataList.length;
  const viewWidth = viewHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const scrollLeftOffset = leftPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const rightPinHeaders = headers.filter((header) => header.pin === 'right');
  const scrollRightOffset = rightPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const requiredKeys = headers.map((header) => header.id) as (keyof TData)[];
  if (!validateTableDataList<TData>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const bodyRef = useRef<HTMLDivElement>(null);

  const [hoverIndex, setHoverIndex] = useState<string | null>(null);

  const getItemKey = useCallback((index: number) => dataList[index].index, [dataList]);
  const scrollToFn = useTableScrollToFn(bodyRef);

  const rowVirtualizer = useVirtualRow({
    count: dataList.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 40,
    getItemKey,
    scrollToFn,
  });

  const rowTotalSize = useMemo(() => {
    return rowVirtualizer.getTotalSize();
  }, [dataList.length]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <FlexRow style={{ position: 'relative' }}>
      <FlexRow
        ref={bodyRef}
        className={'table-body no-scrollbar'}
        style={{
          backgroundColor: tableStyle.tableBodyBackgroundColor,
          overflowY: 'auto',
          overflowX: 'hidden',
          height: rowTotalSize + 15,
          maxHeight: bodyMaxHeight,
        }}
      >
        {/* 왼쪽 고정 영역 */}
        <TableBodyPin
          position={'left'}
          headers={leftPinHeaders}
          rowTotalSize={rowTotalSize}
          virtualItems={virtualItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />

        {/* 중앙 영역 */}
        <TableBodyView
          ref={ref}
          headers={viewHeaders}
          rowTotalSize={rowTotalSize}
          virtualItems={virtualItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />

        {/* 오른쪽 고정 영역 */}
        <TableBodyPin
          position={'right'}
          headers={rightPinHeaders}
          rowTotalSize={rowTotalSize}
          virtualItems={virtualItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />
      </FlexRow>

      <CustomVerticalScrollbar ref={bodyRef} totalContentHeight={viewHeight} />

      <CustomHorizontalScrollbar
        ref={ref}
        totalContentWidth={viewWidth}
        leftOffset={scrollLeftOffset}
        rightOffset={scrollRightOffset}
        border={tableStyle.tableBorder}
      />
    </FlexRow>
  );
}

function TableBodyView({
  ref,
  headers,
  rowTotalSize,
  virtualItems,
  hoverIndex,
  setHoverIndex,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
  rowTotalSize: number;
  virtualItems: VirtualItem[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
}) {
  const { tableStyle, dataList } = useTableContext();

  const viewWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  return (
    <div
      ref={ref}
      className={'table-body-view'}
      style={{
        position: 'relative',
        height: rowTotalSize,
        flexGrow: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div
        className={'table-body-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        {virtualItems.map((virtualItem) => {
          const data = dataList[virtualItem.index];
          const index = data['index'];
          const isOdd = virtualItem.index % 2 === 0;

          return (
            <FlexRow
              key={index}
              className={'table-body-row'}
              style={{
                alignItems: 'center',
                position: 'absolute',
                transform: 'translateY(' + virtualItem.start + 'px)',
                width: viewWidth,
                height: tableStyle.tableBodyHeight,
                borderBottom: tableStyle.tableBorder,
              }}
            >
              {headers.map((header) => {
                return (
                  <TableBodyCell
                    key={header.id + virtualItem.index}
                    rowIndex={virtualItem.index}
                    data={data}
                    index={index}
                    isOdd={isOdd}
                    header={header}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                  />
                );
              })}
            </FlexRow>
          );
        })}
      </div>
    </div>
  );
}

function TableBodyPin({
  position,
  headers,
  rowTotalSize,
  virtualItems,
  hoverIndex,
  setHoverIndex,
}: {
  position: 'left' | 'right';
  headers: THeader[];
  rowTotalSize: number;
  virtualItems: VirtualItem[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
}) {
  const { tableStyle, dataList } = useTableContext();

  const pinHeaderWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={tableBodyRef}
      className={'table-body-pin'}
      style={{
        ...{
          position: 'relative',
          height: rowTotalSize,
          width: pinHeaderWidth,
          minWidth: pinHeaderWidth,
          maxWidth: pinHeaderWidth,
          ...(position === 'left'
            ? { borderRight: tableStyle.tableBorder }
            : { borderLeft: tableStyle.tableBorder }),
          marginBottom: 14,
        },
      }}
    >
      {virtualItems.map((virtualItem) => {
        const data = dataList[virtualItem.index];
        const index = data['index'];
        const isOdd = virtualItem.index % 2 === 0;

        return (
          <FlexRow
            key={index}
            className={'pin-body-row'}
            style={{
              alignItems: 'center',
              position: 'absolute',
              transform: 'translateY(' + virtualItem.start + 'px)',
              width: '100%',
              height: tableStyle.tableBodyHeight,
              borderBottom: tableStyle.tableBorder,
            }}
          >
            {headers.map((header) => {
              return (
                <TableBodyCell
                  key={header.id + virtualItem.index}
                  rowIndex={virtualItem.index}
                  data={data}
                  index={index}
                  isOdd={isOdd}
                  header={header}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                />
              );
            })}
          </FlexRow>
        );
      })}
    </div>
  );
}

function TableBodyCell<TData extends Record<string, any>>({
  rowIndex,
  data,
  index,
  isOdd,
  header,
  hoverIndex,
  setHoverIndex,
}: {
  rowIndex: number;
  data: TData;
  index: string;
  isOdd: boolean;
  header: THeader;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
}) {
  const { tableStyle, handelDataList, isChecked, handleCheck } = useTableContext();

  if (header.id === 'check' && (isChecked === undefined || handleCheck === undefined)) {
    throw new Error('checkedState is required for check header');
  }

  const justifyContent =
    header.align === 'left' ? 'flex-start' : header.align === 'right' ? 'flex-end' : 'center';

  const cellData = data[header.id];

  const getBackgroundColor = () => {
    if (header.id === 'index') {
      return tableStyle.tableHeaderBackgroundColor;
    }
    if (isChecked!(data) && hoverIndex === index) {
      return colors.primary[100];
    }
    if (isChecked!(data)) {
      return colors.primary[50];
    }
    if (hoverIndex === index) {
      return tableStyle.tableBodyHoverBackgroundColor;
    }
    if (isOdd) {
      return tableStyle.tableBodyOddBackgroundColor;
    }

    return tableStyle.tableBodyBackgroundColor;
  };

  return (
    <FlexRow
      as={motion.div}
      className={'table-body-cell'}
      style={{
        boxSizing: 'border-box',
        justifyContent,
        alignItems: 'center',
        paddingInline: 12,
        width: header.width,
        height: '100%',
        backgroundColor: getBackgroundColor(),
        contain: 'paint',
      }}
      onMouseEnter={() => {
        setHoverIndex(index);
      }}
      onMouseLeave={() => {
        setHoverIndex(null);
      }}
      onClick={() => {
        handleCheck!(data);
      }}
    >
      {header.id === 'check' && (
        <Checkbox
          checked={isChecked!(data)}
          onClick={(e) => {
            e.stopPropagation();
            handleCheck!(data);
          }}
        />
      )}
      {typeof header.cell === 'function' ? (
        header.cell({
          cellData,
          rowData: data,
          setCellData: (value) => {
            handelDataList(index, header.id, value);
          },
        })
      ) : (
        <Typography
          style={{
            fontSize: '0.88rem',
            fontWeight: 500,
            color: tableStyle.tableBodyColor,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {header.id === 'index' ? rowIndex + 1 : cellData}
        </Typography>
      )}
    </FlexRow>
  );
}
