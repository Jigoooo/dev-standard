import { useState } from 'react';
import { FlexRow, Input } from '@/shared/components';

const TABLE_BORDER_COLOR = '#bdc3c7';
const TABLE_RESIZE_COLOR = '#cecece';
const TABLE_BORDER = `1px solid ${TABLE_BORDER_COLOR}`;
const TABLE_BORDER_RADIUS = 2;
const TABLE_HEADER_HEIGHT = 36;
const TABLE_HEADER_BACKGROUND_COLOR = '#f5f7f7';
const TABLE_HEADER_COLOR = 'rgba(0, 0, 0, .54)';

type THeader = {
  id: string;
  label: string;
  width: number;
  pin: 'view' | 'left' | 'right';
  filter?: {
    filterType: 'text' | 'select';
    filterValue: string;
  };
};

const HEADERS: THeader[] = [
  { id: 'index', pin: 'left', label: '', width: 60 },
  { id: 'name', pin: 'left', label: 'Name', width: 150 },
  { id: 'address', pin: 'left', label: 'Address', width: 150 },
  ...Array.from({ length: 10 }, (_, index) => ({
    id: `${index}`,
    pin: 'view' as const,
    label: `column${index}`,
    width: 120,
  })),
  { id: 'phoneNumber', pin: 'right', label: 'Phone', width: 150 },
  { id: 'note', pin: 'right', label: 'Note', width: 150 },
];

export function Table({ filterRowEnabled = false }: { filterRowEnabled?: boolean }) {
  const [headers] = useState<THeader[]>(HEADERS);

  const viewHeaders = headers.filter((header) => header.pin === 'view');

  const leftPinHeaders = headers.filter((header) => header.pin === 'left');
  const rightPinHeaders = headers.filter((header) => header.pin === 'right');

  const viewWidth = viewHeaders.reduce((acc, cur) => acc + cur.width, 0);

  return (
    <div
      className={'table-root selection-none'}
      style={{
        height: '100%',
        width: '100%',
        border: TABLE_BORDER,
        borderRadius: TABLE_BORDER_RADIUS,
      }}
    >
      <div
        className={'table-header'}
        style={{
          backgroundColor: TABLE_HEADER_BACKGROUND_COLOR,
          height: filterRowEnabled ? TABLE_HEADER_HEIGHT * 2 : TABLE_HEADER_HEIGHT,
          borderBottom: TABLE_BORDER,
          display: 'flex',
        }}
      >
        {/* 왼쪽 고정 영역 */}
        <TableHeaderLeftPin headers={leftPinHeaders} filterRowEnabled={filterRowEnabled} />

        {/* 중앙 영역 */}
        <div
          className={'table-header-view'}
          style={{
            position: 'relative',
            height: TABLE_HEADER_HEIGHT,
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
                height: TABLE_HEADER_HEIGHT,
              }}
            >
              {viewHeaders.map((header, headerIndex, array) => {
                const left =
                  headerIndex === 0
                    ? 0
                    : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

                return (
                  <FlexRow
                    key={header.id}
                    className={'table-header-cell'}
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      paddingInline: 12,
                      width: header.width,
                      height: TABLE_HEADER_HEIGHT,
                      left: left,
                      contain: 'paint',
                    }}
                  >
                    <TableHeaderLabel label={header.label} />
                    <ResizeHandle position={'right'} />
                  </FlexRow>
                );
              })}
            </div>
          </div>
        </div>

        {/* 오른쪽 고정 영역 */}
        <TableHeaderRightPin headers={rightPinHeaders} />
      </div>
      <div className={'table-body'}>
        <div className={'table-body-left-pin'}></div>
        <div className={'table-body-view'}>
          <div className={'table-body-container'}></div>
        </div>
        <div className={'table-body-right-pin'}></div>
      </div>
    </div>
  );
}

function TableHeaderLabel({ label }: { label: string }) {
  return (
    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: TABLE_HEADER_COLOR }}>{label}</span>
  );
}

function TableHeaderLeftPin({
  headers,
  filterRowEnabled,
}: {
  headers: THeader[];
  filterRowEnabled: boolean;
}) {
  const leftPinHeaderWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

  return (
    <div
      className={'table-header-left-pin'}
      style={{
        position: 'relative',
        height: '100%',
        width: leftPinHeaderWidth,
        minWidth: leftPinHeaderWidth,
        maxWidth: leftPinHeaderWidth,
        borderRight: TABLE_BORDER,
      }}
    >
      <div
        className={'left-pin-header-row'}
        style={{ position: 'absolute', top: 0, width: '100%', height: TABLE_HEADER_HEIGHT }}
      >
        {headers.map((header, headerIndex, array) => {
          const left =
            headerIndex === 0
              ? 0
              : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

          return (
            <FlexRow
              key={header.id}
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
              <TableHeaderLabel label={header.label} />
              <ResizeHandle position={'right'} />
            </FlexRow>
          );
        })}
      </div>
      {filterRowEnabled && (
        <div
          className={'left-pin-filter-row'}
          style={{
            position: 'absolute',
            top: TABLE_HEADER_HEIGHT,
            width: '100%',
            height: TABLE_HEADER_HEIGHT,
            borderTop: TABLE_BORDER,
          }}
        >
          {headers.map((header, headerIndex, array) => {
            const left =
              headerIndex === 0
                ? 0
                : array.slice(0, headerIndex).reduce((acc, cur) => acc + cur.width, 0);

            return (
              <FlexRow
                key={header.id}
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
                {header.id !== 'index' && (
                  <Input
                    style={{
                      height: TABLE_HEADER_HEIGHT - 12,
                      fontSize: '0.8rem',
                      width: '100%',
                      borderRadius: 2,
                    }}
                    isFocusEffect={false}
                  />
                )}
                <ResizeHandle position={'right'} disabled={true} />
              </FlexRow>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TableHeaderRightPin({ headers }: { headers: THeader[] }) {
  const rightPinHeaderWidth = headers.reduce((acc, cur) => acc + cur.width, 0);

  return (
    <div
      className={'table-header-right-pin'}
      style={{
        position: 'relative',
        height: '100%',
        width: rightPinHeaderWidth,
        minWidth: rightPinHeaderWidth,
        maxWidth: rightPinHeaderWidth,
        borderLeft: TABLE_BORDER,
      }}
    >
      <div
        className={'right-pin-header-row'}
        style={{ position: 'absolute', top: 0, width: '100%', height: TABLE_HEADER_HEIGHT }}
      >
        {headers.map((header, headerIndex, array) => {
          const cumulativeWidth = array
            .slice(0, headerIndex)
            .reduce((acc, cur) => acc + cur.width, 0);

          return (
            <FlexRow
              key={header.id}
              style={{
                position: 'absolute',
                alignItems: 'center',
                paddingInline: 12,
                right: cumulativeWidth,
                width: header.width,
                height: '100%',
                contain: 'paint',
              }}
            >
              <TableHeaderLabel label={header.label} />
              <ResizeHandle position={'left'} />
            </FlexRow>
          );
        })}
      </div>
    </div>
  );
}

function ResizeHandle({
  position,
  disabled = false,
}: {
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
      <div style={{ width: 1.6, height: '50%', backgroundColor: TABLE_RESIZE_COLOR }} />
    </div>
  );
}
