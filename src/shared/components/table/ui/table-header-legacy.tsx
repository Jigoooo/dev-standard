import { darken } from 'polished';
import { motion } from 'framer-motion';
import { use } from 'react';

import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import {
  Checkbox,
  calculateTableFixedValues,
  TableContextLegacy,
  FlexRow,
  FlexColumn,
  Divider,
} from '@/shared/components';
import { colors, TABLE_Z_INDEX, TABLE_FIXED_HEADER_Z_INDEX } from '@/shared/constants';

// const TABLE_HEADER_BASE_COLOR = lighten(0.006, colors.primary[50]);
const TABLE_HEADER_BASE_COLOR = '#f6f6f6';
const TABLE_HEADER_LABEL_COLOR = '#454545';
const TABLE_HEADER_SORTED_COLOR = darken(0.05, TABLE_HEADER_BASE_COLOR);
const TABLE_HEADER_BORDER_COLOR = '#e3e3e3';
const TABLE_HEADER_HEIGHT = 42;
const TABLE_COLUMN_DEFAULT_WIDTH = 200;
const TABLE_CHECKBOX_INDEX_WIDTH = 60;
const TABLE_HEADER_BORDER_RADIUS = 12;
const TABLE_HEADER_FIXED_TOP_VALUE = 0;
const TABLE_HEADER_FIXED_LEFT_VALUE = 0;
const SORTED_ICON_SIZE = 12;
const TRANSITION = 'all 0.2s';

export function TableHeaderLegacy({
  checkedState = { isAllChecked: false, isPartiallyChecked: false },
  handleCheckAll = () => {},
}: {
  checkedState?: {
    isAllChecked: boolean;
    isPartiallyChecked: boolean;
  };
  handleCheckAll?: () => void;
}) {
  const tableContext = use(TableContextLegacy);

  if (tableContext === null) {
    return;
  }

  const { headers, dataList, handleSort, visibleCheckbox, visibleIndex, fixed } = tableContext;

  return (
    <FlexRow
      style={{
        height: TABLE_HEADER_HEIGHT,
        borderTopLeftRadius: TABLE_HEADER_BORDER_RADIUS,
        borderTopRightRadius: TABLE_HEADER_BORDER_RADIUS,
        position: 'sticky',
        top: TABLE_HEADER_FIXED_TOP_VALUE,
        zIndex: TABLE_FIXED_HEADER_Z_INDEX,
      }}
    >
      {visibleCheckbox && (
        <FlexRow
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: TABLE_CHECKBOX_INDEX_WIDTH,
            backgroundColor: TABLE_HEADER_BASE_COLOR,
            borderBottom: `1px solid ${TABLE_HEADER_BORDER_COLOR}`,
            position: fixed ? 'sticky' : 'static',
            left: TABLE_HEADER_FIXED_LEFT_VALUE,
            zIndex: fixed ? TABLE_Z_INDEX : 'auto',
          }}
        >
          <Checkbox
            disabled={dataList.length === 0}
            checked={checkedState.isAllChecked}
            isPartial={checkedState.isPartiallyChecked}
            onClick={handleCheckAll}
          />
        </FlexRow>
      )}
      {visibleIndex && (
        <FlexRow
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: TABLE_CHECKBOX_INDEX_WIDTH,
            backgroundColor: TABLE_HEADER_BASE_COLOR,
            borderBottom: `1px solid ${TABLE_HEADER_BORDER_COLOR}`,
            position: fixed ? 'sticky' : 'static',
            left: visibleCheckbox ? TABLE_CHECKBOX_INDEX_WIDTH : TABLE_HEADER_FIXED_LEFT_VALUE,
            zIndex: fixed ? TABLE_Z_INDEX : 'auto',
            color: TABLE_HEADER_LABEL_COLOR,
          }}
        >
          #
        </FlexRow>
      )}
      {headers.map((header, headerIndex) => {
        if (header.hidden) {
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

        const sortUpFill = header.sorter.direction === 'asc' ? colors.primary[400] : '#bbbbbb';
        const sortDownFill = header.sorter.direction === 'desc' ? colors.primary[400] : '#bbbbbb';

        return (
          <FlexRow
            key={header.id}
            as={motion.div}
            style={{
              flex: header?.width ? 'none' : 1,
              flexShrink: 0,
              display: 'flex',
              width: header?.width ?? 'auto',
              alignItems: 'center',
              gap: 16,
              paddingLeft: 18,
              cursor: header.sorter.sortable ? 'pointer' : 'auto',
              borderBottom: `1px solid ${TABLE_HEADER_BORDER_COLOR}`,
              backgroundColor:
                header.sorter.sortable && !!header.sorter.direction
                  ? TABLE_HEADER_SORTED_COLOR
                  : TABLE_HEADER_BASE_COLOR,
              transition: TRANSITION,
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
            onClick={() => handleSort(header.id)}
            variants={{
              hover: {
                backgroundColor: TABLE_HEADER_SORTED_COLOR,
              },
              none: {},
            }}
            whileHover={header.sorter.sortable && !header.sorter.direction ? 'none' : 'hover'}
          >
            <span style={{ fontWeight: 600, fontSize: '0.94rem', color: TABLE_HEADER_LABEL_COLOR }}>
              {header.label}
            </span>
            <FlexRow
              style={{
                alignItems: 'center',
                gap: 16,
              }}
            >
              {header.sorter.sortable && (
                <FlexColumn style={{ position: 'relative' }}>
                  <ExpandLessOutlinedIcon
                    sx={{
                      position: 'absolute',
                      bottom: -2.4,
                      right: 0,
                      width: SORTED_ICON_SIZE,
                      height: SORTED_ICON_SIZE,
                      fill: sortUpFill,
                      transition: TRANSITION,
                      stroke: sortUpFill,
                      strokeWidth: 2,
                    }}
                  />
                  <ExpandMoreOutlinedIcon
                    sx={{
                      position: 'absolute',
                      top: -2.4,
                      right: 0,
                      width: SORTED_ICON_SIZE,
                      height: SORTED_ICON_SIZE,
                      fill: sortDownFill,
                      transition: TRANSITION,
                      stroke: sortDownFill,
                      strokeWidth: 2,
                    }}
                  />
                </FlexColumn>
              )}
              {headerIndex !== headers.length - 1 && (
                <Divider
                  style={{
                    ...{
                      backgroundColor:
                        !isRightEdgeOfLeftFixed && !isLeftEdgeOfRightFixed
                          ? '#e1e1e1'
                          : 'transparent',
                    },
                  }}
                  direction='vertical'
                />
              )}
            </FlexRow>
          </FlexRow>
        );
      })}
    </FlexRow>
  );
}
