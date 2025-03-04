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
import { colors } from '@/shared/constants';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBody<TData extends { index: string }>({
  ref,
  headers,
  dataList,
  handelDataList,
  tableStyle,
  bodyMaxHeight,
  isChecked,
  handleCheck,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
  dataList: TData[];
  handelDataList: (index: string, key: string, value: any) => void;
  tableStyle: TTableStyle;
  bodyMaxHeight: number;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
}) {
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
          tableStyle={tableStyle}
          position={'left'}
          headers={leftPinHeaders}
          dataList={dataList}
          handelDataList={handelDataList}
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
          handelDataList={handelDataList}
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
          handelDataList={handelDataList}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          isChecked={isChecked}
          handleCheck={handleCheck}
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

function TableBodyView<TData extends Record<string, any>>({
  ref,
  tableStyle,
  headers,
  dataList,
  handelDataList,
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
}: {
  ref: RefObject<HTMLDivElement | null>;
  tableStyle: TTableStyle;
  headers: THeader[];
  dataList: TData[];
  handelDataList: (index: string, key: string, value: any) => void;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
}) {
  const viewWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

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
                    key={header.id}
                    rowIndex={virtualIndex}
                    tableStyle={tableStyle}
                    data={data}
                    handelDataList={handelDataList}
                    index={index}
                    isOdd={isOdd}
                    header={header}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    isChecked={isChecked}
                    handleCheck={handleCheck}
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

function TableBodyPin<TData extends Record<string, any>>({
  tableStyle,
  position,
  headers,
  dataList,
  handelDataList,
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  headers: THeader[];
  dataList: TData[];
  handelDataList: (index: string, key: string, value: any) => void;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
}) {
  const pinHeaderWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

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
                  key={header.id}
                  rowIndex={virtualIndex}
                  tableStyle={tableStyle}
                  data={data}
                  handelDataList={handelDataList}
                  index={index}
                  isOdd={isOdd}
                  header={header}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                  isChecked={isChecked}
                  handleCheck={handleCheck}
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
  tableStyle,
  rowIndex,
  data,
  handelDataList,
  index,
  isOdd,
  header,
  hoverIndex,
  setHoverIndex,
  isChecked,
  handleCheck,
}: {
  tableStyle: TTableStyle;
  rowIndex: number;
  data: TData;
  handelDataList: (index: string, key: string, value: any) => void;
  index: string;
  isOdd: boolean;
  header: THeader;
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  isChecked?: (data: TData) => boolean;
  handleCheck?: (data: TData) => void;
  leftOffset?: number;
}) {
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
          {header.id === 'index' ? rowIndex + 1 : cellData}
        </span>
      )}
    </FlexRow>
  );
}
