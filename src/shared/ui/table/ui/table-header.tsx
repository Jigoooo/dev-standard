import { RefObject } from 'react';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import { Checkbox, FlexRow, Input, THeader, Typography } from 'shared/ui';
import { useTableContext } from '../model/table-context.ts';

// function sortHeadersByGroup<TData>(
//   headers: THeader<TData>[],
//   headerGroups?: THeaderGroup<TData>[],
// ): THeader[] {
//   if (!headerGroups || headerGroups.length === 0) {
//     return headers;
//   }
//
//   return [...headers].sort((a, b) => {
//     const groupIndexA = headerGroups.findIndex((group) => group.headerIds.includes(a.id));
//     const groupIndexB = headerGroups.findIndex((group) => group.headerIds.includes(b.id));
//     return groupIndexA - groupIndexB;
//   });
// }

export function TableHeader({ ref }: { ref: RefObject<HTMLDivElement | null> }) {
  const { tableStyle, headerHeight, sortedHeaders: headers } = useTableContext();

  const viewHeaders = headers.filter((header) => header.pin === 'view');
  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const rightPinHeaders = headers.filter((header) => header.pin === 'right');

  return (
    <FlexRow
      className={'table-header'}
      style={{
        backgroundColor: tableStyle.tableHeaderBackgroundColor,
        height: headerHeight,
        borderBottom: tableStyle.tableBorder,
        width: '100%',
      }}
    >
      {/* 왼쪽 고정 영역 */}
      <TableHeaderPin position={'left'} headers={leftPinHeaders} />

      {/* 중앙 영역 */}
      <TableHeaderView ref={ref} headers={viewHeaders} />

      {/* 오른쪽 고정 영역 */}
      <TableHeaderPin position={'right'} headers={rightPinHeaders} />
    </FlexRow>
  );
}

function TableHeaderView({
  ref,
  headers,
}: {
  ref: RefObject<HTMLDivElement | null>;
  headers: THeader[];
}) {
  const { tableStyle, headerGroups, viewportWidth, filterRowEnabled } = useTableContext();

  const mappingHeaderGroups = headers.map((header) => {
    const findGroups = headerGroups.find((group) => group.headerIds.includes(header.id));
    return {
      header,
      groupLabel: findGroups?.groupLabel ?? '',
    };
  });

  const groupHeaderHeight =
    headerGroups && headerGroups.length > 0 ? tableStyle.tableHeaderHeight : 0;
  const headerRowHeight = tableStyle.tableHeaderHeight;

  const viewWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  return (
    <div
      ref={ref}
      className={'table-header-view'}
      style={{
        position: 'relative',
        height: '100%',
        flexGrow: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        minWidth: viewportWidth,
      }}
    >
      <div
        className={'table-header-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        {headerGroups.length > 0 && (
          <FlexRow
            className={'table-header-row'}
            style={{
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              width: viewWidth,
              height: tableStyle.tableHeaderHeight,
              borderBottom: tableStyle.tableBorder,
            }}
          >
            <TableGroupHeaders mappingHeaderGroups={mappingHeaderGroups} position={'left'} />
          </FlexRow>
        )}
        <FlexRow
          className={'table-header-row'}
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: groupHeaderHeight,
            width: viewWidth,
            height: tableStyle.tableHeaderHeight,
          }}
        >
          {headers.map((header, index) => {
            return (
              <TableHeaderCell
                key={header.id + index}
                header={header}
                isVisibleHandler={index !== headers.length - 1}
                position={'left'}
              />
            );
          })}
        </FlexRow>
        {filterRowEnabled && (
          <FlexRow
            className={'table-header-row'}
            style={{
              alignItems: 'center',
              position: 'absolute',
              top: groupHeaderHeight + headerRowHeight,
              width: viewWidth,
              height: tableStyle.tableHeaderHeight,
              borderTop: tableStyle.tableBorder,
            }}
          >
            {headers.map((header, index) => {
              return (
                <TableHeaderFilterCell
                  key={header.id + index}
                  header={header}
                  isVisibleHandler={index !== headers.length - 1}
                  position={'left'}
                />
              );
            })}
          </FlexRow>
        )}
      </div>
    </div>
  );
}

function TableHeaderPin({ position, headers }: { position: 'left' | 'right'; headers: THeader[] }) {
  const { tableStyle, headerGroups, filterRowEnabled } = useTableContext();

  const mappingHeaderGroups = headers.map((header) => {
    const findGroups = headerGroups.find((group) => group.headerIds.includes(header.id));
    return {
      header,
      groupLabel: findGroups?.groupLabel ?? '',
    };
  });

  const groupHeaderHeight =
    headerGroups && headerGroups.length > 0 ? tableStyle.tableHeaderHeight : 0;
  const headerRowHeight = tableStyle.tableHeaderHeight;

  const pinHeaderWidth = headers.reduce((acc, cur) => acc + (cur?.width ?? 0), 0);

  return (
    <div
      className={'table-header-pin'}
      style={{
        ...{
          position: 'relative',
          height: '100%',
          width: pinHeaderWidth,
          minWidth: pinHeaderWidth,
          maxWidth: pinHeaderWidth,
        },
        ...(position === 'left'
          ? { borderRight: tableStyle.tableFixedBorder }
          : { borderLeft: tableStyle.tableFixedBorder }),
      }}
    >
      {headerGroups.length > 0 && (
        <FlexRow
          className={'pin-header-row'}
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            width: '100%',
            height: tableStyle.tableHeaderHeight,
            borderBottom: tableStyle.tableBorder,
          }}
        >
          <TableGroupHeaders mappingHeaderGroups={mappingHeaderGroups} position={position} />
        </FlexRow>
      )}
      <FlexRow
        className={'pin-header-row'}
        style={{
          alignItems: 'center',
          position: 'absolute',
          top: groupHeaderHeight,
          width: '100%',
          height: tableStyle.tableHeaderHeight,
        }}
      >
        {headers.map((header, index, array) => {
          const isVisibleHandler =
            position === 'left' ? index !== 0 && index !== array.length - 1 : index !== 0;

          return (
            <TableHeaderCell
              key={header.id + index}
              header={header}
              isVisibleHandler={isVisibleHandler}
              position={position}
            />
          );
        })}
      </FlexRow>
      {filterRowEnabled && (
        <FlexRow
          className={'pin-filter-row'}
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: groupHeaderHeight + headerRowHeight,
            width: '100%',
            height: tableStyle.tableHeaderHeight,
            borderTop: tableStyle.tableBorder,
          }}
        >
          {headers.map((header, index, array) => {
            const isVisibleHandler =
              position === 'left' ? index !== 0 && index !== array.length - 1 : index !== 0;

            return (
              <TableHeaderFilterCell
                key={header.id + index}
                header={header}
                isVisibleHandler={isVisibleHandler}
                position={position}
              />
            );
          })}
        </FlexRow>
      )}
    </div>
  );
}

function TableGroupHeaders({
  mappingHeaderGroups,
  position,
}: {
  mappingHeaderGroups: { header: THeader; groupLabel: string }[];
  position: 'left' | 'right';
}) {
  const { tableStyle } = useTableContext();

  return (
    <>
      {mappingHeaderGroups.map(({ header, groupLabel }, index, array) => {
        const prevGroupLabel = array[index - 1]?.groupLabel;
        const isSamePrevGroup = prevGroupLabel === groupLabel;

        const nextGroupLabel = array[index + 1]?.groupLabel;
        const isSameNextGroup = nextGroupLabel === groupLabel;

        const noSameGroup = !isSamePrevGroup && !isSameNextGroup;

        let totalWidth = 0;
        for (let i = index; i < array.length; i++) {
          if (array[i].groupLabel === groupLabel) {
            totalWidth += array[i].header.width;
          } else {
            break;
          }
        }

        if (isSamePrevGroup) {
          return null;
        }

        return (
          <FlexRow
            key={header.id + index}
            className={'table-header-cell'}
            style={{
              ...{
                position: 'relative',
                boxSizing: 'border-box',
                alignItems: 'center',
                paddingInline: 12,
                width: totalWidth,
                height: tableStyle.tableHeaderHeight,
                contain: 'paint',
              },
              // ...(position === 'left' &&
              //   index === 0 && {
              //     borderLeft: tableStyle.tableBorder,
              //   }),
              ...(position === 'left' && {
                borderRight:
                  (isSameNextGroup || noSameGroup) && index !== array.length - 1
                    ? tableStyle.tableBorder
                    : undefined,
              }),
              ...(position === 'right' && {
                borderLeft:
                  (isSameNextGroup || noSameGroup) && index !== 0
                    ? tableStyle.tableBorder
                    : undefined,
              }),
            }}
          >
            {!isSamePrevGroup && groupLabel && (
              <FlexRow
                style={{
                  position: 'sticky',
                  left: 10,
                  alignItems: 'center',
                  overflow: 'hidden',
                  gap: 6,
                }}
              >
                <Typography
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: tableStyle.tableHeaderColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {groupLabel}
                </Typography>
              </FlexRow>
            )}
          </FlexRow>
        );
      })}
    </>
  );
}

function TableHeaderCell({
  isVisibleHandler,
  header,
  position,
}: {
  header: THeader;
  isVisibleHandler: boolean;
  position: 'left' | 'right';
}) {
  const { headers, tableStyle, verticalScrollWidth, checkedState, handleCheckAll, handleSort } =
    useTableContext();

  if (header.id === 'check' && checkedState === undefined) {
    throw new Error('checkedState is required for check header');
  }

  const isLastCell = headers[headers.length - 1].id === header.id;

  const justifyContent =
    header.headerAlign === 'left' || header.headerAlign === undefined
      ? 'flex-start'
      : header.headerAlign === 'right'
        ? 'flex-end'
        : 'center';

  return (
    <FlexRow
      className={'table-header-cell'}
      style={{
        ...{
          boxSizing: 'border-box',
          justifyContent: header.id === 'check' ? 'center' : justifyContent,
          alignItems: 'center',
          marginRight: isLastCell ? verticalScrollWidth : 0,
          paddingInline: 12,
          width: header.width,
          height: tableStyle.tableHeaderHeight,
          contain: 'paint',
          cursor: header.sorter.sortable ? 'pointer' : 'default',
        },
        ...(position === 'left' && {
          borderRight:
            header.id !== 'index' && isVisibleHandler ? tableStyle.tableBorder : undefined,
        }),
        ...(position === 'right' && {
          borderLeft:
            header.id !== 'index' && isVisibleHandler ? tableStyle.tableBorder : undefined,
        }),
      }}
      onClick={() => {
        if (header.id !== 'index' && header.id !== 'check' && header.sorter.sortable) {
          handleSort(header.id);
        }
      }}
    >
      {header.id === 'check' && (
        <Checkbox
          checked={checkedState!.isAllChecked}
          isPartial={checkedState!.isPartiallyChecked}
          onClick={handleCheckAll}
        />
      )}
      {header.label && (
        <FlexRow style={{ fontSize: '0.84rem', alignItems: 'center', gap: 6 }}>
          <Typography
            style={{
              fontSize: 'inherit',
              fontWeight: 600,
              color: tableStyle.tableHeaderColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {header.label}
          </Typography>
          {header.sorter.direction === 'asc' && <NorthIcon style={{ fontSize: 'inherit' }} />}
          {header.sorter.direction === 'desc' && <SouthIcon style={{ fontSize: 'inherit' }} />}
        </FlexRow>
      )}
    </FlexRow>
  );
}

function TableHeaderFilterCell({
  header,
  isVisibleHandler,
  position,
}: {
  header: THeader;
  isVisibleHandler: boolean;
  position: 'left' | 'right';
}) {
  const { headers, tableStyle, verticalScrollWidth, onChangeFilterValue } = useTableContext();
  const isLastCell = headers[headers.length - 1].id === header.id;

  return (
    <FlexRow
      className={'table-header-cell'}
      style={{
        ...{
          alignItems: 'center',
          marginRight: isLastCell ? verticalScrollWidth : 0,
          paddingInline: 12,
          width: header.width,
          height: '100%',
          contain: 'paint',
        },
        ...(position === 'left' && {
          borderRight:
            header.id !== 'index' && isVisibleHandler ? tableStyle.tableBorder : undefined,
        }),
        ...(position === 'right' && {
          borderLeft:
            header.id !== 'index' && isVisibleHandler ? tableStyle.tableBorder : undefined,
        }),
      }}
    >
      {header.filter && (
        <Input
          style={{
            height: tableStyle.tableHeaderHeight - 12,
            fontSize: '0.8rem',
            width: '100%',
            borderRadius: 2,
          }}
          value={header.filter.filterValue}
          onChange={(event) => onChangeFilterValue(header.id, event.target.value)}
          isFocusEffect={false}
        />
      )}
    </FlexRow>
  );
}

// function ResizeHandle({
//   isVisible = true,
//   tableStyle,
//   position,
//   disabled = true,
// }: {
//   isVisible?: boolean;
//   tableStyle: TTableStyle;
//   position: 'left' | 'right';
//   disabled?: boolean;
// }) {
//   return (
//     <div
//       style={{
//         ...{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           position: 'absolute',
//           zIndex: 2,
//           height: '100%',
//           width: 1.6,
//           top: 0,
//           cursor: disabled ? 'default' : 'ew-resize',
//         },
//         ...(position === 'left' && { left: -4 }),
//         ...(position === 'right' && { right: -4 }),
//       }}
//     >
//       <div
//         style={{
//           width: '100%',
//           height: '60%',
//           backgroundColor: isVisible ? tableStyle.tableResizeColor : 'transparent',
//         }}
//       />
//     </div>
//   );
// }
