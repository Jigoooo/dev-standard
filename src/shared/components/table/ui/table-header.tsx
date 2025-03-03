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
}) {
  const viewWidth = headers.reduce((acc, cur) => acc + cur.width, 0);
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
        <div
          className={'table-header-row'}
          style={{
            position: 'absolute',
            top: 0,
            width: viewWidth,
            height: tableStyle.tableHeaderHeight,
          }}
        >
          {headers.map((header, headerIndex, array) => {
            return (
              <TableHeaderCell
                key={header.id}
                tableStyle={tableStyle}
                header={header}
                headerIndex={headerIndex}
                array={array}
                checkedState={checkedState}
                handleCheckAll={handleCheckAll}
              />
            );
          })}
        </div>
        {filterRowEnabled && (
          <div
            className={'table-header-row'}
            style={{
              position: 'absolute',
              top: tableStyle.tableHeaderHeight,
              width: viewWidth,
              height: tableStyle.tableHeaderHeight,
              borderTop: tableStyle.tableBorder,
            }}
          >
            {headers.map((header, headerIndex, array) => {
              return (
                <TableHeaderFilterCell
                  key={header.id}
                  tableStyle={tableStyle}
                  position={'right'}
                  header={header}
                  headerIndex={headerIndex}
                  array={array}
                  onChangeFilterValue={onChangeFilterValue}
                />
              );
            })}
          </div>
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
}) {
  const pinHeaderWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

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
      <div
        className={'pin-header-row'}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: tableStyle.tableHeaderHeight,
        }}
      >
        {headers.map((header, headerIndex, array) => {
          return (
            <TableHeaderCell
              key={header.id}
              tableStyle={tableStyle}
              header={header}
              headerIndex={headerIndex}
              array={array}
              checkedState={checkedState}
              handleCheckAll={handleCheckAll}
            />
          );
        })}
      </div>
      {filterRowEnabled && (
        <div
          className={'pin-filter-row'}
          style={{
            position: 'absolute',
            top: tableStyle.tableHeaderHeight,
            width: '100%',
            height: tableStyle.tableHeaderHeight,
            borderTop: tableStyle.tableBorder,
          }}
        >
          {headers.map((header, headerIndex, array) => {
            return (
              <TableHeaderFilterCell
                key={header.id}
                tableStyle={tableStyle}
                position={position}
                header={header}
                headerIndex={headerIndex}
                array={array}
                onChangeFilterValue={onChangeFilterValue}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function TableHeaderLabel({ tableStyle, label }: { tableStyle: TTableStyle; label: string }) {
  return (
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
      {label}
    </span>
  );
}

function TableHeaderCell({
  tableStyle,
  header,
  headerIndex,
  array,
  checkedState,
  handleCheckAll = () => {},
}: {
  tableStyle: TTableStyle;
  header: THeader;
  headerIndex: number;
  array: THeader[];
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
}) {
  if (header.id === 'check' && checkedState === undefined) {
    throw new Error('checkedState is required for check header');
  }

  const left =
    headerIndex === 0 ? 0 : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

  return (
    <FlexRow
      key={header.id}
      className={'table-header-cell'}
      style={{
        boxSizing: 'border-box',
        position: 'absolute',
        justifyContent: header.id === 'check' ? 'center' : 'flex-start',
        alignItems: 'center',
        paddingInline: 12,
        width: header.width,
        height: tableStyle.tableHeaderHeight,
        left: left,
        contain: 'paint',
      }}
    >
      {header.id === 'check' && (
        <Checkbox
          checked={checkedState!.isAllChecked}
          isPartial={checkedState!.isPartiallyChecked}
          onClick={handleCheckAll}
        />
      )}
      {header.label && <TableHeaderLabel tableStyle={tableStyle} label={header.label} />}
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
  headerIndex,
  array,
  onChangeFilterValue,
}: {
  tableStyle: TTableStyle;
  position: 'left' | 'right';
  header: THeader;
  headerIndex: number;
  array: THeader[];
  onChangeFilterValue: (headerId: string, value: string) => void;
}) {
  const left =
    headerIndex === 0 ? 0 : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

  return (
    <FlexRow
      key={header.id}
      className={'table-header-cell'}
      style={{
        position: 'absolute',
        alignItems: 'center',
        paddingInline: 12,
        left: left,
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
