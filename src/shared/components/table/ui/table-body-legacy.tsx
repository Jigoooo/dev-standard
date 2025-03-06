import { darken } from 'polished';
import { Usable, use, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { colors, TABLE_Z_INDEX } from '@/shared/constants';
import {
  Checkbox,
  calculateTableFixedValues,
  TableContextLegacy,
  TTableContextLegacy,
  FlexColumn,
  FlexRow,
  Link,
  Typography,
} from '@/shared/components';
import { NoData } from '@/entities/main';
import { motion } from 'framer-motion';

const TABLE_HEADER_BASE_COLOR = '#f8f8f8';
const TABLE_HEADER_SORTED_COLOR = '#f8f8f8';
const TABLE_BODY_BASE_COLOR = '#ffffff';
const TABLE_COLUMN_VALUE_COLOR = '#000000';
const TABLE_BODY_BORDER_COLOR = '#e3e3e3';
const TABLE_BODY_CHECKED_COLOR = darken(0.02, colors.primary[50]);
const TABLE_BODY_HOVER_COLOR = darken(0.07, colors.primary[50]);
const TABLE_BODY_DEFAULT_HEIGHT = 300;
const TABLE_ROW_HEIGHT = 46;
const TABLE_COLUMN_DEFAULT_WIDTH = 200;
const TABLE_CHECKBOX_INDEX_WIDTH = 60;
const TABLE_HEADER_FIXED_LEFT_VALUE = 0;
const TRANSITION = 'all 0.2s';

function validateDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(item, key)),
  );
}

export function TableBodyLegacy<T>({
  keyLabel,
  onClickKey,
  checkList = [],
  handleCheck = () => {},
  emptyMessage = '데이터가 없습니다.',
}: {
  keyLabel: keyof T;
  onClickKey?: (key: string | number) => void;
  checkList?: (string | number)[];
  handleCheck?: (key: string | number) => void;
  emptyMessage?: string;
}) {
  const tableContext = use(TableContextLegacy as unknown as Usable<TTableContextLegacy<T>>);

  if (tableContext === null) {
    throw new Error(`Table context is null. Please check the Table context `);
  }

  const { headers, dataList, visibleCheckbox, visibleIndex, fixed, pagination } = tableContext;

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: dataList.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => TABLE_ROW_HEIGHT,
    overscan: 10,
  });

  const requiredKeys = headers.map((header) => header.id) as (keyof T)[];
  if (!validateDataList<T>(dataList, requiredKeys)) {
    throw new Error(`dataList does not match the required type: ${JSON.stringify(requiredKeys)}`);
  }

  const currentPageStartIndex = pagination ? (pagination.currentPage - 1) * pagination.pageSize : 0;

  return (
    <>
      {dataList.length === 0 ? (
        <div
          style={{
            width: '100%',
            height: TABLE_BODY_DEFAULT_HEIGHT,
            backgroundColor: '#fbfbfb',
          }}
        >
          <NoData emptyMessage={emptyMessage} />
        </div>
      ) : (
        <FlexColumn
          ref={tableBodyRef}
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: '100%',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((item, rowIndex) => {
            const data = dataList[item.index];

            const keyLabelString = String(data[keyLabel]);

            const isChecked = checkList.includes(keyLabelString);

            const globalIndex = currentPageStartIndex + rowIndex + 1;

            return (
              <FlexRow
                key={keyLabelString}
                as={motion.div}
                style={{
                  width: '100%',
                  minHeight: TABLE_ROW_HEIGHT,
                  height: TABLE_ROW_HEIGHT,
                  cursor: visibleCheckbox ? 'pointer' : 'auto',
                  backgroundColor: isChecked ? TABLE_BODY_CHECKED_COLOR : TABLE_BODY_BASE_COLOR,
                  transition: TRANSITION,
                }}
                variants={{
                  checkedHover: {
                    backgroundColor: TABLE_BODY_HOVER_COLOR,
                  },
                  hover: {
                    backgroundColor: TABLE_HEADER_BASE_COLOR,
                  },
                }}
                transition={{
                  duration: 0.1,
                }}
                whileHover={isChecked ? 'checkedHover' : 'hover'}
                onClick={() => {
                  const keyHeader = headers.find((header) => header.id === keyLabel);

                  if (keyHeader?.hidden) {
                    onClickKey?.(keyLabelString);
                    return;
                  }

                  if (visibleCheckbox) {
                    handleCheck(keyLabelString);
                  }
                }}
              >
                {visibleCheckbox && (
                  <FlexRow
                    as={motion.div}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: TABLE_CHECKBOX_INDEX_WIDTH,
                      position: fixed ? 'sticky' : 'static',
                      left: TABLE_HEADER_FIXED_LEFT_VALUE,
                      zIndex: fixed ? TABLE_Z_INDEX : 'auto',
                      borderBottom: `1px solid ${TABLE_BODY_BORDER_COLOR}`,
                      backgroundColor: isChecked || fixed ? 'inherit' : 'transparent',
                    }}
                    transition={{
                      duration: 0.1,
                    }}
                    whileHover={{
                      backgroundColor: 'inherit',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheck(keyLabelString);
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheck(keyLabelString);
                      }}
                    />
                  </FlexRow>
                )}
                {visibleIndex && (
                  <FlexRow
                    as={motion.div}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: TABLE_CHECKBOX_INDEX_WIDTH,
                      position: fixed ? 'sticky' : 'static',
                      left: visibleCheckbox
                        ? TABLE_CHECKBOX_INDEX_WIDTH
                        : TABLE_HEADER_FIXED_LEFT_VALUE,
                      zIndex: fixed ? TABLE_Z_INDEX : 'auto',
                      borderBottom: `1px solid ${TABLE_BODY_BORDER_COLOR}`,
                      backgroundColor: isChecked || fixed ? 'inherit' : 'transparent',
                    }}
                    whileHover={{
                      backgroundColor: 'inherit',
                    }}
                  >
                    <Typography style={{ color: TABLE_COLUMN_VALUE_COLOR }}>
                      {globalIndex}
                    </Typography>
                  </FlexRow>
                )}
                {headers.map((header, headerIndex) => {
                  const value = data[header.id as keyof T];

                  if (typeof value !== 'string' && typeof value !== 'number') {
                    return null;
                  }

                  const {
                    isRightFixed,
                    isLeftFixed,
                    isHeaderFixed,
                    fixedRightValue,
                    fixedLeftValue,
                    isRightEdgeOfLeftFixed,
                    isLeftEdgeOfRightFixed,
                  } = calculateTableFixedValues({
                    headers,
                    headerIndex,
                    visibleCheckbox,
                    visibleIndex,
                    fixed,
                    tableColumnDefaultWidth: TABLE_COLUMN_DEFAULT_WIDTH,
                    tableCheckboxIndexWidth: TABLE_CHECKBOX_INDEX_WIDTH,
                  });

                  const isSortedHeaderAndNotChecked =
                    !isChecked && header.sorter.sortable && header.sorter.direction !== null;

                  return (
                    <FlexRow
                      key={header.id}
                      style={{
                        flex: header?.width ? 'none' : 1,
                        flexShrink: 0,
                        width: header?.width ?? 'auto',
                        alignItems: 'center',
                        paddingInline: 20,
                        borderBottom: `1px solid ${TABLE_BODY_BORDER_COLOR}`,
                        backgroundColor: isSortedHeaderAndNotChecked
                          ? TABLE_HEADER_SORTED_COLOR
                          : isChecked || fixed
                            ? 'inherit'
                            : 'transparent',
                        position: isHeaderFixed ? 'sticky' : 'static',
                        right: isRightFixed ? fixedRightValue : 'auto',
                        left: isLeftFixed ? fixedLeftValue : 'auto',
                        zIndex: isHeaderFixed ? TABLE_Z_INDEX : 'auto',
                        boxShadow: isLeftEdgeOfRightFixed
                          ? '-10px 0 8px 1px rgba(0, 0, 0, 0.03)'
                          : isRightEdgeOfLeftFixed
                            ? '10px 0 8px 1px rgba(0, 0, 0, 0.03)'
                            : 'none',
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '0.94rem',
                          fontWeight: 400,
                          color: TABLE_COLUMN_VALUE_COLOR,
                        }}
                      >
                        {keyLabelString === value ? (
                          <Link
                            style={{ fontWeight: 500, color: colors.primary[400] }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickKey?.(keyLabelString);
                            }}
                          >
                            {value}
                          </Link>
                        ) : (
                          value
                        )}
                      </Typography>
                    </FlexRow>
                  );
                })}
              </FlexRow>
            );
          })}
        </FlexColumn>
      )}
    </>
  );
}
