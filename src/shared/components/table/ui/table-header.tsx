import { Checkbox, FlexRow, Input, THeader, TTableStyle } from '@/shared/components';
import { RefObject } from 'react';

export function TableHeader({
  ref,
  tableStyle,
  headers,
  filterRowEnabled,
  onChangeFilterValue,
  checkedState,
  handleCheckAll,
  handleSort,
}: {
  ref: RefObject<HTMLDivElement | null>;
  tableStyle: TTableStyle;
  headers: THeader[];
  filterRowEnabled: boolean;
  onChangeFilterValue: (headerId: string, value: string) => void;
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
  handleSort: (key: string) => void;
}) {
  const viewHeaders = headers.filter((header) => header.pin === 'view');

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const rightPinHeaders = headers.filter((header) => header.pin === 'right');

  return (
    <FlexRow
      className={'table-header'}
      style={{
        backgroundColor: tableStyle.tableHeaderBackgroundColor,
        height: filterRowEnabled ? tableStyle.tableHeaderHeight * 2 : tableStyle.tableHeaderHeight,
        borderBottom: tableStyle.tableBorder,
      }}
    >
      {/* 왼쪽 고정 영역 */}
      <TableHeaderPin
        tableStyle={tableStyle}
        position={'left'}
        headers={leftPinHeaders}
        filterRowEnabled={filterRowEnabled}
        onChangeFilterValue={onChangeFilterValue}
        checkedState={checkedState}
        handleCheckAll={handleCheckAll}
        handleSort={handleSort}
      />

      {/* 중앙 영역 */}
      <TableHeaderView
        ref={ref}
        tableStyle={tableStyle}
        headers={viewHeaders}
        filterRowEnabled={filterRowEnabled}
        onChangeFilterValue={onChangeFilterValue}
        checkedState={checkedState}
        handleCheckAll={handleCheckAll}
        handleSort={handleSort}
      />

      {/* 오른쪽 고정 영역 */}
      <TableHeaderPin
        tableStyle={tableStyle}
        position={'right'}
        headers={rightPinHeaders}
        filterRowEnabled={filterRowEnabled}
        onChangeFilterValue={onChangeFilterValue}
        checkedState={checkedState}
        handleCheckAll={handleCheckAll}
        handleSort={handleSort}
      />
    </FlexRow>
  );
}

function TableHeaderView({
  ref,
  tableStyle,
  headers,
  filterRowEnabled,
  onChangeFilterValue,
  checkedState,
  handleCheckAll,
  handleSort,
}: {
  ref: RefObject<HTMLDivElement | null>;
  tableStyle: TTableStyle;
  headers: THeader[];
  filterRowEnabled: boolean;
  onChangeFilterValue: (headerId: string, value: string) => void;
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
  handleSort: (key: string) => void;
}) {
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
      }}
    >
      <div
        className={'table-header-container'}
        style={{ position: 'relative', width: viewWidth, height: '100%' }}
      >
        <FlexRow
          className={'table-header-row'}
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            width: viewWidth,
            height: tableStyle.tableHeaderHeight,
          }}
        >
          {headers.map((header) => {
            return (
              <TableHeaderCell
                key={header.id}
                tableStyle={tableStyle}
                header={header}
                checkedState={checkedState}
                handleCheckAll={handleCheckAll}
                handleSort={handleSort}
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
              top: tableStyle.tableHeaderHeight,
              width: viewWidth,
              height: tableStyle.tableHeaderHeight,
              borderTop: tableStyle.tableBorder,
            }}
          >
            {headers.map((header) => {
              return (
                <TableHeaderFilterCell
                  key={header.id}
                  tableStyle={tableStyle}
                  position={'right'}
                  header={header}
                  onChangeFilterValue={onChangeFilterValue}
                />
              );
            })}
          </FlexRow>
        )}
      </div>
    </div>
  );
}

function TableHeaderPin({
  tableStyle,
  position,
  headers,
  filterRowEnabled,
  onChangeFilterValue,
  checkedState,
  handleCheckAll,
  handleSort,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  headers: THeader[];
  filterRowEnabled: boolean;
  onChangeFilterValue: (headerId: string, value: string) => void;
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
  handleSort: (key: string) => void;
}) {
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
          ? { borderRight: tableStyle.tableBorder }
          : { borderLeft: tableStyle.tableBorder }),
      }}
    >
      <FlexRow
        className={'pin-header-row'}
        style={{
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: tableStyle.tableHeaderHeight,
        }}
      >
        {headers.map((header) => {
          return (
            <TableHeaderCell
              key={header.id}
              tableStyle={tableStyle}
              header={header}
              checkedState={checkedState}
              handleCheckAll={handleCheckAll}
              handleSort={handleSort}
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
            top: tableStyle.tableHeaderHeight,
            width: '100%',
            height: tableStyle.tableHeaderHeight,
            borderTop: tableStyle.tableBorder,
          }}
        >
          {headers.map((header) => {
            return (
              <TableHeaderFilterCell
                key={header.id}
                tableStyle={tableStyle}
                position={position}
                header={header}
                onChangeFilterValue={onChangeFilterValue}
              />
            );
          })}
        </FlexRow>
      )}
    </div>
  );
}

function TableHeaderCell({
  tableStyle,
  header,
  checkedState,
  handleCheckAll = () => {},
  handleSort,
}: {
  tableStyle: TTableStyle;
  header: THeader;
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
  handleSort: (key: string) => void;
}) {
  if (header.id === 'check' && checkedState === undefined) {
    throw new Error('checkedState is required for check header');
  }

  return (
    <FlexRow
      key={header.id}
      className={'table-header-cell'}
      style={{
        boxSizing: 'border-box',
        justifyContent: header.id === 'check' ? 'center' : 'flex-start',
        alignItems: 'center',
        paddingInline: 12,
        width: header.width,
        height: tableStyle.tableHeaderHeight,
        contain: 'paint',
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
        <span
          style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: tableStyle.tableHeaderColor,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {header.label}
        </span>
      )}
      {header.id !== 'index' && header.id !== 'check' && (
        <ResizeHandle tableStyle={tableStyle} position={'right'} />
      )}
    </FlexRow>
  );
}

function TableHeaderFilterCell({
  tableStyle,
  position,
  header,
  onChangeFilterValue,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  header: THeader;
  onChangeFilterValue: (headerId: string, value: string) => void;
}) {
  return (
    <FlexRow
      key={header.id}
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
