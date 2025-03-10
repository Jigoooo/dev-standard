import { RefObject } from 'react';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import {
  Checkbox,
  FlexRow,
  Input,
  THeader,
  TTableStyle,
  Typography,
  useTableContext,
} from '@/shared/components';

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
            <TableGroupHeaders mappingHeaderGroups={mappingHeaderGroups} />
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
            return <TableHeaderCell key={header.id + index} header={header} />;
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
                <TableHeaderFilterCell key={header.id + index} position={'right'} header={header} />
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
          <TableGroupHeaders mappingHeaderGroups={mappingHeaderGroups} />
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
        {headers.map((header, index) => {
          return <TableHeaderCell key={header.id + index} header={header} />;
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
          {headers.map((header, index) => {
            return (
              <TableHeaderFilterCell key={header.id + index} position={position} header={header} />
            );
          })}
        </FlexRow>
      )}
    </div>
  );
}

function TableGroupHeaders({
  mappingHeaderGroups,
}: {
  mappingHeaderGroups: { header: THeader; groupLabel: string }[];
}) {
  const { tableStyle } = useTableContext();

  return (
    <>
      {mappingHeaderGroups.map(({ header, groupLabel }, index, array) => {
        const prevGroupLabel = array[index - 1]?.groupLabel;
        const isSamePrevGroup = prevGroupLabel === groupLabel;

        const nextGroupLabel = array[index + 1]?.groupLabel;
        const isSameNextGroup = nextGroupLabel === groupLabel;

        if (isSamePrevGroup) {
          return (
            <FlexRow
              key={header.id + index}
              className={'table-header-cell'}
              style={{
                boxSizing: 'border-box',
                alignItems: 'center',
                height: tableStyle.tableHeaderHeight,
                width: 1.4,
                contain: 'paint',
              }}
            >
              {!isSameNextGroup && (
                <ResizeHandle tableStyle={tableStyle} position={'right'} disabled={true} />
              )}
            </FlexRow>
          );
        }

        let totalWidth = 0;
        for (let i = index; i < array.length; i++) {
          if (array[i].groupLabel === groupLabel) {
            totalWidth += array[i].header.width;
          } else {
            break;
          }
        }

        return (
          <FlexRow
            key={header.id + index}
            className={'table-header-cell'}
            style={{
              position: 'relative',
              boxSizing: 'border-box',
              alignItems: 'center',
              paddingInline: 12,
              width: totalWidth,
              height: tableStyle.tableHeaderHeight,
              contain: 'paint',
            }}
          >
            {!isSamePrevGroup && groupLabel && (
              <FlexRow style={{ position: 'sticky', left: 10, alignItems: 'center', gap: 6 }}>
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
            {!isSameNextGroup && (
              <ResizeHandle tableStyle={tableStyle} position={'right'} disabled={true} />
            )}
          </FlexRow>
        );
      })}
    </>
  );
}

function TableHeaderCell({ header }: { header: THeader }) {
  const { tableStyle, checkedState, handleCheckAll, handleSort } = useTableContext();

  if (header.id === 'check' && checkedState === undefined) {
    throw new Error('checkedState is required for check header');
  }

  return (
    <FlexRow
      className={'table-header-cell'}
      style={{
        boxSizing: 'border-box',
        justifyContent: header.id === 'check' ? 'center' : 'flex-start',
        alignItems: 'center',
        paddingInline: 12,
        width: header.width,
        height: tableStyle.tableHeaderHeight,
        contain: 'paint',
        cursor: header.sorter.sortable ? 'pointer' : 'default',
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
        <FlexRow style={{ fontSize: '0.88rem', alignItems: 'center', gap: 6 }}>
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
      {header.id !== 'index' && header.id !== 'check' && (
        <ResizeHandle tableStyle={tableStyle} position={'right'} />
      )}
    </FlexRow>
  );
}

function TableHeaderFilterCell({
  position,
  header,
}: {
  position: 'left' | 'right';
  header: THeader;
}) {
  const { tableStyle, onChangeFilterValue } = useTableContext();

  return (
    <FlexRow
      className={'table-header-cell'}
      style={{
        alignItems: 'center',
        paddingInline: 12,
        width: header.width,
        height: '100%',
        contain: 'paint',
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
      {header.id !== 'index' && header.id !== 'check' && (
        <ResizeHandle
          tableStyle={tableStyle}
          position={position === 'left' ? 'right' : 'left'}
          disabled={true}
        />
      )}
    </FlexRow>
  );
}

function ResizeHandle({
  tableStyle,
  position,
  disabled = true,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        ...{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 2,
          height: '100%',
          width: 8,
          top: 0,
          cursor: disabled ? 'default' : 'ew-resize',
        },
        ...(position === 'left' && { left: -4 }),
        ...(position === 'right' && { right: -4 }),
      }}
    >
      <div style={{ width: 1.6, height: '50%', backgroundColor: tableStyle.tableResizeColor }} />
    </div>
  );
}
