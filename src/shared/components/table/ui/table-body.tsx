import { RefObject, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';

import {
  Checkbox,
  CustomHorizontalScrollbar,
  CustomVerticalScrollbar,
  FlexRow,
  THeader,
  TTableStyle,
} from '@/shared/components';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBody<TData extends { index: string }>({
  ref,
  headers,
  dataList,
  tableStyle,
  headerHeight,
  isChecked,
  handleCheck,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
  dataList: TData[];
  tableStyle: TTableStyle;
  headerHeight: number;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
}) {
  const viewHeaders = headers.filter((header) => header.pin === 'view');
  const viewWidth = viewHeaders.reduce((acc, cur) => acc + cur.width, 0);

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const scrollLeftOffset = leftPinHeaders.reduce((acc, cur) => acc + cur.width, 0);

  const rightPinHeaders = headers.filter((header) => header.pin === 'right');
  const scrollRightOffset = rightPinHeaders.reduce((acc, cur) => acc + cur.width, 0);

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
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />

        {/* 중앙 영역 */}
        <TableBodyView
          ref={ref}
          tableStyle={tableStyle}
          headers={viewHeaders}
          dataList={dataList}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />

        {/* 오른쪽 고정 영역 */}
        <TableBodyPin
          tableStyle={tableStyle}
          position={'right'}
          headers={rightPinHeaders}
          dataList={dataList}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />
      </FlexRow>

      <CustomVerticalScrollbar
        ref={bodyRef}
        totalContentHeight={tableStyle.tableBodyHeight * dataList.length}
      />

      <CustomHorizontalScrollbar
        ref={ref}
        totalContentWidth={viewWidth}
        leftOffset={scrollLeftOffset}
        rightOffset={scrollRightOffset}
      />
    </FlexRow>
  );
}

function TableBodyView<TData extends Record<string, any>>({
  ref,
  tableStyle,
  headers,
  dataList,
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
}: {
  ref: RefObject<HTMLDivElement | null>;
  tableStyle: TTableStyle;
  headers: THeader[];
  dataList: TData[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
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
                borderBottom: tableStyle.tableBorder,
              }}
            >
              {headers.map((header, headerIndex, array) => {
                return (
                  <TableBodyCell
                    key={header.id}
                    tableStyle={tableStyle}
                    data={data}
                    index={index}
                    isOdd={isOdd}
                    header={header}
                    headerIndex={headerIndex}
                    array={array}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    isChecked={isChecked}
                    handleCheck={handleCheck}
                  />
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
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  headers: THeader[];
  dataList: TData[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
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
          marginBottom: 14,
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
              borderBottom: tableStyle.tableBorder,
            }}
          >
            {headers.map((header, headerIndex, array) => {
              return (
                <TableBodyCell
                  key={header.id}
                  tableStyle={tableStyle}
                  data={data}
                  index={index}
                  isOdd={isOdd}
                  header={header}
                  headerIndex={headerIndex}
                  array={array}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                  isChecked={isChecked}
                  handleCheck={handleCheck}
                  leftOffset={position === 'left' ? -1 : 0}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function TableBodyCell<TData extends Record<string, any>>({
  tableStyle,
  data,
  index,
  isOdd,
  header,
  headerIndex,
  array,
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
  leftOffset = 0,
}: {
  tableStyle: TTableStyle;
  data: TData;
  index: string;
  isOdd: boolean;
  header: THeader;
  headerIndex: number;
  array: THeader[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
  leftOffset?: number;
}) {
  if (header.id === 'check' && (isChecked === undefined || handleCheck === undefined)) {
    throw new Error('checkedState is required for check header');
  }

  const left =
    headerIndex === 0 ? 0 : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);
  const justifyContent =
    header.align === 'left' ? 'flex-start' : header.align === 'right' ? 'flex-end' : 'center';

  const cellData = data[header.id];

  return (
    <FlexRow
      as={motion.div}
      className={'table-body-cell'}
      key={header.id}
      style={{
        boxSizing: 'border-box',
        position: 'absolute',
        justifyContent,
        alignItems: 'center',
        paddingInline: 12,
        left: left + leftOffset,
        // width: header.width - 1, // todo 보정해야 하는 이유 찾기
        width: header.width,
        height: '100%',
        backgroundColor:
          hoverIndex === index
            ? tableStyle.tableBodyHoverBackgroundColor
            : header.id === 'index'
              ? tableStyle.tableHeaderBackgroundColor
              : isOdd
                ? tableStyle.tableBodyOddBackgroundColor
                : tableStyle.tableBodyBackgroundColor,
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
      {header.customCell ? (
        header.customCell(cellData, data)
      ) : (
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
          {cellData}
        </span>
      )}
    </FlexRow>
  );
}
