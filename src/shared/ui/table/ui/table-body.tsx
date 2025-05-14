import type { RefObject } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Checkbox,
  CustomHorizontalScrollbar,
  CustomVerticalScrollbar,
  FlexRow,
  Input,
  Typography,
} from '@/shared/ui';
import { colors } from '@/shared/constants';
import type { EditType, TableBodyRowProps, DataWithIndex, THeader } from '../model/table-type.ts';
import { useTableContext } from '../model/table-context.ts';
import { validateTableDataList } from '../model/validate-table-data-list.ts';
import { useTableScrollToFn, useVirtualRow } from '../model';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { NoData } from '@/entities/main';

export const TableBody = memo(function TableBody<TData extends DataWithIndex>({
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

  const isValidDataList = useMemo(() => {
    return validateTableDataList<TData>(dataList, requiredKeys);
  }, [dataList, requiredKeys]);

  if (!isValidDataList.valid) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [rowClickIndex, setRowClickIndex] = useState<number | null>(null);

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
          height: memoizedItems.length === 0 ? bodyMaxHeight : rowTotalSize + 15,
          width: memoizedItems.length === 0 ? '100%' : 'auto',
          maxHeight: bodyMaxHeight,
        }}
      >
        <AnimatePresence initial={false}>
          {memoizedItems.length === 0 && (
            <FlexRow
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <NoData emptyMessage={'데이터가 없습니다.'} />
            </FlexRow>
          )}
        </AnimatePresence>

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

      <AnimatePresence initial={false}>
        {memoizedItems.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CustomVerticalScrollbar ref={bodyYRef} totalContentHeight={viewHeight} />
            <CustomHorizontalScrollbar
              ref={bodyXRef}
              totalContentWidth={viewWidth}
              leftOffset={scrollLeftOffset}
              rightOffset={scrollRightOffset}
              border={tableStyle.tableBorder}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  rowClickIndex: number | null;
  setRowClickIndex: (index: number | null) => void;
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
              dataIndex={index}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
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
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  rowClickIndex: number | null;
  setRowClickIndex: (index: number | null) => void;
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
            dataIndex={index}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            rowClickIndex={rowClickIndex}
            setRowClickIndex={setRowClickIndex}
          />
        );
      })}
    </div>
  );
});

function areEqualTableRow(prevProps: TableBodyRowProps, nextProps: TableBodyRowProps) {
  const prevHovered = prevProps.hoverIndex === prevProps.dataIndex;
  const nextHovered = nextProps.hoverIndex === nextProps.dataIndex;
  const prevRowClicked = prevProps.rowClickIndex === prevProps.dataIndex;
  const nextRowClicked = nextProps.rowClickIndex === nextProps.dataIndex;

  return (
    prevHovered === nextHovered &&
    prevRowClicked === nextRowClicked &&
    prevProps.virtualItem.start === nextProps.virtualItem.start &&
    prevProps.rowWidth === nextProps.rowWidth &&
    prevProps.dataIndex === nextProps.dataIndex &&
    prevProps.headers === nextProps.headers &&
    prevProps.setHoverIndex === nextProps.setHoverIndex &&
    prevProps.setRowClickIndex === nextProps.setRowClickIndex
  );
}

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
            virtualRowIndex={virtualItem.index}
            isLastHeaderIndex={headerIndex === array.length - 1}
            data={data}
            dataIndex={index}
            cellIndex={headerIndex}
            isOdd={isOdd}
            header={header}
            hoverIndex={hoverIndex}
            rowClickIndex={rowClickIndex}
          />
        );
      })}
    </FlexRow>
  );
}, areEqualTableRow);

const TableBodyCell = memo(function TableBodyCell<TData extends Record<string, any>>({
  virtualRowIndex,
  isLastHeaderIndex,
  data,
  dataIndex,
  cellIndex: _cellIndex,
  isOdd,
  header,
  hoverIndex,
  rowClickIndex,
}: {
  virtualRowIndex: number;
  isLastHeaderIndex: boolean;
  data: TData;
  dataIndex: number;
  cellIndex: number;
  isOdd: boolean;
  header: THeader;
  hoverIndex: number | null;
  rowClickIndex: number | null;
}) {
  const {
    tableStyle,
    headers,
    verticalScrollWidth,
    handelDataList,
    deleteDataList,
    isChecked,
    handleCheck,
    editMode,
  } = useTableContext();

  if (header.id === 'check' && (isChecked === undefined || handleCheck === undefined)) {
    throw new Error('checkedState is required for check header');
  }

  const [isEdit, setIsEdit] = useState(false);
  const [editType, setEditType] = useState<EditType>('input');
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useHandleClickOutsideRef({
    condition: isEdit,
    outsideClickAction: () => {
      if (editType !== 'input' && editType !== 'none') {
        return;
      }
      setIsEdit(false);
    },
  });

  const justifyContent =
    header.dataAlign === 'left'
      ? 'flex-start'
      : header.dataAlign === 'right'
        ? 'flex-end'
        : 'center';

  const cellData = data[header.id];

  const getBackgroundColor = () => {
    if (header.id === 'index' && rowClickIndex !== dataIndex) {
      return tableStyle.tableHeaderBackgroundColor;
    }
    if (
      (isChecked!(data) && hoverIndex === dataIndex) ||
      (hoverIndex === dataIndex && rowClickIndex === dataIndex)
    ) {
      return colors.primary[100];
    }
    if (isChecked!(data)) {
      return colors.primary[50];
    }
    if (rowClickIndex === dataIndex) {
      // return tableStyle.tableBodyHoverBackgroundColor;
      return colors.primary[50];
    }
    if (hoverIndex === dataIndex) {
      return tableStyle.tableBodyHoverBackgroundColor;
    }
    if (isOdd) {
      return tableStyle.tableBodyOddBackgroundColor;
    }

    return tableStyle.tableBodyBackgroundColor;
  };

  const isCheckedAvailableHeader = headers.find((header) => header.id === 'check');
  const lastRightPinnedHeader = headers.filter((header) => header.pin === 'right').pop();
  const isLastCell = lastRightPinnedHeader?.id === header.id;

  return (
    <FlexRow
      ref={cellRef}
      className={'table-body-cell'}
      style={{
        boxSizing: 'border-box',
        justifyContent,
        alignItems: 'center',
        paddingInline: isEdit ? 0 : 12,
        marginRight: isLastCell ? verticalScrollWidth - 2 : 0,
        width: header.width,
        height: '100%',
        backgroundColor: getBackgroundColor(),
        contain: 'paint',
        borderRight:
          tableStyle.showVerticalLines && !isLastHeaderIndex ? tableStyle.tableBorder : undefined,
        overflow: 'hidden',
      }}
      onClick={() => {
        if (editMode) {
          return;
        }

        if (isCheckedAvailableHeader) {
          handleCheck(data);
        }
      }}
      onDoubleClick={() => {
        if (!editMode) {
          return;
        }

        setIsEdit(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef?.current.focus();
          }
        }, 0);
      }}
    >
      {isEdit ? (
        <>
          {typeof header.editCell === 'function' ? (
            header.editCell({
              inputRef,
              cellData,
              rowData: data,
              handleRowData: (key, value) => {
                handelDataList(dataIndex, key, value);
              },
              setCellData: (value) => {
                handelDataList(dataIndex, header.id, value);
              },
              tableStyle,
              exitEditMode: () => {
                inputRef.current?.blur();
                setIsEdit(false);
              },
              setEditType,
            })
          ) : (
            <Input
              ref={inputRef}
              style={{
                height: tableStyle.tableHeaderHeight,
                fontSize: '0.8rem',
                width: '100%',
                borderRadius: 0,
                boxShadow: 'none',
              }}
              value={cellData}
              onChange={(event) => {
                handelDataList(dataIndex, header.id, event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  inputRef.current?.blur();
                  setIsEdit(false);
                }
              }}
            />
          )}
        </>
      ) : typeof header.cell === 'function' ? (
        header.cell({
          cellData,
          rowData: data,
          handleRowData: (key, value) => {
            handelDataList(dataIndex, key, value);
          },
          deleteRow: () => {
            deleteDataList(dataIndex);
          },
          setCellData: (value) => {
            handelDataList(dataIndex, header.id, value);
          },
          tableStyle,
        })
      ) : header.id === 'check' ? (
        <Checkbox
          isActiveAnimation={false}
          checked={isChecked!(data)}
          onClick={(e) => {
            e.stopPropagation();
            handleCheck(data);
          }}
        />
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
          {header.id === 'index'
            ? virtualRowIndex + 1
            : header.formatter
              ? header.formatter({
                  cellData,
                  rowData: data,
                })
              : cellData}
        </Typography>
      )}
    </FlexRow>
  );
});
