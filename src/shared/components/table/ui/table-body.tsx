import { memo, RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { VirtualItem } from '@tanstack/react-virtual';

import {
  Checkbox,
  CustomHorizontalScrollbar,
  CustomVerticalScrollbar,
  FlexRow,
  TableBodyRowProps,
  THeader,
  Typography,
  useTableContext,
  useTableScrollToFn,
  useVirtualRow,
  validateTableDataList,
} from '@/shared/components';
import { colors } from '@/shared/constants';

export const TableBody = memo(function TableBody<TData extends { index: string }>({
  bodyXRef,
}: {
  bodyXRef: RefObject<HTMLDivElement | null>;
}) {
  'use no memo';

  const { tableStyle, bodyYRef, bodyMaxHeight, headers, dataList } = useTableContext();

  const viewHeaders = useMemo(() => {
    return headers.filter((header) => header.pin === 'view');
  }, [headers]);
  const viewHeight = useMemo(() => {
    return tableStyle.tableBodyHeight * dataList.length;
  }, [tableStyle.tableBodyHeight, dataList.length]);
  const viewWidth = useMemo(() => {
    return viewHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);
  }, [viewHeaders]);

  const leftPinHeaders = useMemo(() => {
    return headers.filter((header) => header.pin === 'left');
  }, [headers]);
  const scrollLeftOffset = useMemo(() => {
    return leftPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);
  }, [leftPinHeaders]);

  const rightPinHeaders = useMemo(() => {
    return headers.filter((header) => header.pin === 'right');
  }, [headers]);
  const scrollRightOffset = useMemo(() => {
    return rightPinHeaders.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);
  }, [rightPinHeaders]);

  const requiredKeys = useMemo(() => {
    return headers.map((header) => header.id) as (keyof TData)[];
  }, [headers]);
  if (!validateTableDataList<TData>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const [hoverIndex, setHoverIndex] = useState<string | null>(null);
  const [rowClickIndex, setRowClickIndex] = useState<string | null>(null);

  const getItemKey = useCallback((index: number) => dataList[index].index, [dataList]);
  const scrollToFn = useTableScrollToFn(bodyYRef);

  const rowVirtualizer = useVirtualRow({
    count: dataList.length,
    getScrollElement: () => bodyYRef.current,
    estimateSize: () => tableStyle.tableBodyHeight,
    overscan: 20,
    getItemKey,
    scrollToFn,
  });

  const rowTotalSize = rowVirtualizer.getTotalSize();
  const virtualItems = rowVirtualizer.getVirtualItems();

  const memoizedRowTotalSize = useMemo(() => {
    return rowTotalSize;
  }, [rowTotalSize]);

  const memoizedItems = useMemo(() => {
    return virtualItems;
  }, [virtualItems]);

  return (
    <FlexRow style={{ position: 'relative', width: '100%' }}>
      <FlexRow
        ref={bodyYRef}
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
          rowTotalSize={memoizedRowTotalSize}
          virtualItems={memoizedItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          rowClickIndex={rowClickIndex}
          setRowClickIndex={setRowClickIndex}
        />

        {/* 중앙 영역 */}
        <TableBodyView
          ref={bodyXRef}
          headers={viewHeaders}
          rowTotalSize={memoizedRowTotalSize}
          virtualItems={memoizedItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          rowClickIndex={rowClickIndex}
          setRowClickIndex={setRowClickIndex}
        />

        {/* 오른쪽 고정 영역 */}
        <TableBodyPin
          position={'right'}
          headers={rightPinHeaders}
          rowTotalSize={memoizedRowTotalSize}
          virtualItems={memoizedItems}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          rowClickIndex={rowClickIndex}
          setRowClickIndex={setRowClickIndex}
        />
      </FlexRow>

      <CustomVerticalScrollbar ref={bodyYRef} totalContentHeight={viewHeight} />

      <CustomHorizontalScrollbar
        ref={bodyXRef}
        totalContentWidth={viewWidth}
        leftOffset={scrollLeftOffset}
        rightOffset={scrollRightOffset}
        border={tableStyle.tableBorder}
      />
    </FlexRow>
  );
});

const TableBodyView = memo(function TableBodyView({
  ref,
  headers,
  rowTotalSize,
  virtualItems,
  hoverIndex,
  setHoverIndex,
  rowClickIndex,
  setRowClickIndex,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
  rowTotalSize: number;
  virtualItems: VirtualItem[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  rowClickIndex: string | null;
  setRowClickIndex: (index: string | null) => void;
}) {
  const { viewportWidth, dataList } = useTableContext();

  const viewWidth = useMemo(() => {
    return headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);
  }, [headers]);

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
        minWidth: viewportWidth,
      }}
    >
      <div
        className={'table-body-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        {virtualItems.map((virtualItem) => {
          const data = dataList[virtualItem.index];
          const index = data['index'];

          return (
            <TableBodyRow
              key={index}
              headers={headers}
              virtualItem={virtualItem}
              rowWidth={viewWidth}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              index={index}
              rowClickIndex={rowClickIndex}
              setRowClickIndex={setRowClickIndex}
            />
          );
        })}
      </div>
    </div>
  );
});

const TableBodyPin = memo(function TableBodyPin({
  position,
  headers,
  rowTotalSize,
  virtualItems,
  hoverIndex,
  setHoverIndex,
  rowClickIndex,
  setRowClickIndex,
}: {
  position: 'left' | 'right';
  headers: THeader[];
  rowTotalSize: number;
  virtualItems: VirtualItem[];
  hoverIndex: string | null;
  setHoverIndex: (index: string | null) => void;
  rowClickIndex: string | null;
  setRowClickIndex: (index: string | null) => void;
}) {
  const { tableStyle, dataList } = useTableContext();

  const pinHeaderWidth = useMemo(() => {
    return headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);
  }, [headers]);

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
            ? { borderRight: tableStyle.tableFixedBorder }
            : { borderLeft: tableStyle.tableFixedBorder }),
          marginBottom: 14,
        },
      }}
    >
      {virtualItems.map((virtualItem) => {
        const data = dataList[virtualItem.index];
        const index = data['index'];

        return (
          <TableBodyRow
            key={index}
            headers={headers}
            virtualItem={virtualItem}
            rowWidth={'100%'}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            index={index}
            rowClickIndex={rowClickIndex}
            setRowClickIndex={setRowClickIndex}
          />
        );
      })}
    </div>
  );
});

// function areEqualTableRow(prevProps: TableBodyRowProps, nextProps: TableBodyRowProps) {
//   const prevHovered = prevProps.hoverIndex === prevProps.index;
//   const nextHovered = nextProps.hoverIndex === nextProps.index;
//   return (
//     prevHovered === nextHovered &&
//     prevProps.virtualItem.start === nextProps.virtualItem.start &&
//     prevProps.rowWidth === nextProps.rowWidth
//   );
// }

const TableBodyRow = memo(function TableBodyRow({
  headers,
  virtualItem,
  rowWidth,
  hoverIndex,
  setHoverIndex,
  rowClickIndex,
  setRowClickIndex,
}: TableBodyRowProps) {
  const { tableStyle, dataList, tableRowClick } = useTableContext();

  const data = dataList[virtualItem.index];
  const index = data['index'];
  const isOdd = virtualItem.index % 2 === 0;

  return (
    <FlexRow
      className={'table-body-row'}
      style={{
        alignItems: 'center',
        position: 'absolute',
        transform: 'translateY(' + virtualItem.start + 'px)',
        width: rowWidth,
        height: tableStyle.tableBodyHeight,
        borderBottom: tableStyle.tableBorder,
      }}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
      onClick={() => {
        if (tableRowClick) {
          tableRowClick(data);
          setRowClickIndex(index);
        }
      }}
    >
      {headers.map((header, headerIndex, array) => {
        return (
          <TableBodyCell
            key={header.id + virtualItem.index + headerIndex}
            rowIndex={virtualItem.index}
            isLastHeaderIndex={headerIndex === array.length - 1}
            data={data}
            index={index}
            isOdd={isOdd}
            header={header}
            hoverIndex={hoverIndex}
            rowClickIndex={rowClickIndex}
          />
        );
      })}
    </FlexRow>
  );
});

const TableBodyCell = memo(function TableBodyCell<TData extends Record<string, any>>({
  rowIndex,
  isLastHeaderIndex,
  data,
  index,
  isOdd,
  header,
  hoverIndex,
  rowClickIndex,
}: {
  rowIndex: number;
  isLastHeaderIndex: boolean;
  data: TData;
  index: string;
  isOdd: boolean;
  header: THeader;
  hoverIndex: string | null;
  rowClickIndex: string | null;
}) {
  const { tableStyle, headers, handelDataList, isChecked, handleCheck } = useTableContext();

  if (header.id === 'check' && (isChecked === undefined || handleCheck === undefined)) {
    throw new Error('checkedState is required for check header');
  }

  const justifyContent =
    header.dataAlign === 'left'
      ? 'flex-start'
      : header.dataAlign === 'right'
        ? 'flex-end'
        : 'center';

  const cellData = data[header.id];

  const getBackgroundColor = () => {
    if (header.id === 'index' && rowClickIndex !== index) {
      return tableStyle.tableHeaderBackgroundColor;
    }
    if (
      (isChecked!(data) && hoverIndex === index) ||
      (hoverIndex === index && rowClickIndex === index)
    ) {
      return colors.primary[100];
    }
    if (isChecked!(data)) {
      return colors.primary[50];
    }
    if (rowClickIndex === index) {
      // return tableStyle.tableBodyHoverBackgroundColor;
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

  const isCheckedAvailableHeader = headers.find((header) => header.id === 'check');

  return (
    <FlexRow
      className={'table-body-cell'}
      style={{
        boxSizing: 'border-box',
        justifyContent,
        alignItems: 'center',
        paddingInline: 12,
        width: header.id === 'check' ? header.width + 1 : header.width,
        height: '100%',
        backgroundColor: getBackgroundColor(),
        contain: 'paint',
        borderRight:
          tableStyle.showVerticalLines && !isLastHeaderIndex ? tableStyle.tableBorder : undefined,
        overflow: 'hidden',
      }}
      onClick={() => {
        if (isCheckedAvailableHeader) {
          handleCheck(data);
        }
      }}
    >
      {header.id === 'check' && (
        <Checkbox
          isActiveAnimation={false}
          checked={isChecked!(data)}
          onClick={(e) => {
            e.stopPropagation();
            handleCheck(data);
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
            fontSize: '0.84rem',
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
});
