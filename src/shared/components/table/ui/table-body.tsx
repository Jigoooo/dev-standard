import { RefObject, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';

import {
  Checkbox,
  CustomHorizontalScrollbar,
  CustomVerticalScrollbar,
  FlexRow,
  THeader,
  Typography,
  useTableContext,
} from '@/shared/components';
import { colors } from '@/shared/constants';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBody<TData extends { index: string }>({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  const { tableStyle, bodyMaxHeight, headers, dataList } = useTableContext();

  const viewHeaders = headers.filter((header) => header.pin === 'view');
  const viewHeight = tableStyle.tableBodyHeight * dataList.length;
  const viewWidth = viewHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const scrollLeftOffset = leftPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const rightPinHeaders = headers.filter((header) => header.pin === 'right');
  const scrollRightOffset = rightPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const requiredKeys = headers.map((header) => header.id) as (keyof TData)[];
  if (!validateDataList<TData>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const bodyRef = useRef<HTMLDivElement>(null);

  const [hoverIndex, setHoverIndex] = useState<string | null>(null);

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
          maxHeight: bodyMaxHeight,
        }}
      >
        {/* 왼쪽 고정 영역 */}
        <TableBodyPin
          position={'left'}
          headers={leftPinHeaders}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />

        {/* 중앙 영역 */}
        <TableBodyView
          ref={ref}
          headers={viewHeaders}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
        />

        {/* 오른쪽 고정 영역 */}
        <TableBodyPin
          position={'right'}
          headers={rightPinHeaders}
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
  hoverIndex,
  setHoverIndex,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
}) {
  const { tableStyle, dataList } = useTableContext();

  const viewWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => ref.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 1,
    initialRect: { width: viewWidth, height: tableStyle.tableBodyHeight },
    getItemKey: (index) => dataList[index].index,
  });

  return (
    <div
      ref={ref}
      className={'table-body-view'}
      style={{
        position: 'relative',
        height: rowVirtualizer.getTotalSize(),
        // height: dataList.length * tableStyle.tableBodyHeight,
        flexGrow: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div
        className={'table-body-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        {/*{dataList.map((data, dataIndex) => {*/}
        {rowVirtualizer.getVirtualItems().map((virtualItem, dataIndex) => {
          const data = dataList[virtualItem.index];
          const index = data['index'];
          const isOdd = dataIndex % 2 === 0;
          // const startOffset = dataIndex * tableStyle.tableBodyHeight;

          return (
            <FlexRow
              key={index}
              className={'table-body-row'}
              style={{
                alignItems: 'center',
                position: 'absolute',
                transform: 'translateY(' + virtualItem.start + 'px)',
                // transform: 'translateY(' + startOffset + 'px)',
                width: viewWidth,
                height: tableStyle.tableBodyHeight,
                borderBottom: tableStyle.tableBorder,
              }}
            >
              {headers.map((header) => {
                return (
                  <TableBodyCell
                    key={header.id}
                    rowIndex={dataIndex}
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
  hoverIndex,
  setHoverIndex,
}: {
  position: 'left' | 'right';
  headers: THeader[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
}) {
  const { tableStyle, dataList } = useTableContext();

  const pinHeaderWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const pinWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 1,
    initialRect: { width: pinWidth, height: tableStyle.tableBodyHeight },
    getItemKey: (index) => dataList[index].index,
  });

  return (
    <div
      ref={tableBodyRef}
      className={'table-body-pin'}
      style={{
        ...{
          position: 'relative',
          // height: dataList.length * tableStyle.tableBodyHeight,
          height: rowVirtualizer.getTotalSize(),
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
      {/*{dataList.map((data, dataIndex) => {*/}
      {rowVirtualizer.getVirtualItems().map((virtualItem, dataIndex) => {
        const data = dataList[virtualItem.index];
        const index = data['index'];
        const isOdd = dataIndex % 2 === 0;
        // const startOffset = dataIndex * tableStyle.tableBodyHeight;

        return (
          <FlexRow
            key={index}
            className={'pin-body-row'}
            style={{
              alignItems: 'center',
              position: 'absolute',
              transform: 'translateY(' + virtualItem.start + 'px)',
              // transform: 'translateY(' + startOffset + 'px)',
              width: '100%',
              height: tableStyle.tableBodyHeight,
              borderBottom: tableStyle.tableBorder,
            }}
          >
            {headers.map((header) => {
              return (
                <TableBodyCell
                  key={header.id}
                  rowIndex={dataIndex}
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
      key={header.id + rowIndex}
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
