import { ReactNode, useMemo, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';

import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { FlexRow } from '@/shared/components';

type SelectOption = {
  label: ReactNode;
  value: string | number;
};

export function MultiSelect<ValuesType extends (string | number)[]>({
  label = '',
  values,
  onChange,
  options,
  containerWidth,
  containerMinWidth = 160,
  containerHeight = 38,
}: {
  label?: string;
  values: ValuesType;
  onChange: (value: ValuesType) => void;
  options: SelectOption[];
  containerWidth?: string | number;
  containerMinWidth?: string | number;
  containerHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useHandleClickOutsideRef({
    condition: isOpen,
    outsideClickAction: () => setIsOpen(false),
  });

  const selectedOptions = useMemo(
    () => options.filter((option) => values.includes(option.value)).map((option) => option),
    [options, values],
  );

  const toggleSelectBox = () => setIsOpen(!isOpen);

  const isAllSelected = selectedOptions.length === 0 || selectedOptions.length === options.length;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        minWidth: containerMinWidth,
        width: containerWidth || 'auto',
      }}
      className='selection-none'
    >
      <SelectContainer
        label={label}
        isOpen={isOpen}
        selectedOptions={selectedOptions}
        deleteValue={(option) => {
          onChange(values.filter((value) => value !== option.value) as ValuesType);
        }}
        isAllSelected={isAllSelected}
        toggleSelectBox={toggleSelectBox}
        containerHeight={containerHeight}
      />
      {isOpen && (
        <SelectItems
          options={options}
          selectedValues={values}
          selectValue={(newValues) => {
            onChange(newValues);
          }}
        />
      )}
    </div>
  );
}

function SelectContainer({
  label,
  isOpen,
  selectedOptions = [],
  deleteValue,
  isAllSelected,
  toggleSelectBox,
  containerHeight,
}: {
  label?: string;
  isOpen: boolean;
  selectedOptions: SelectOption[];
  deleteValue: (option: SelectOption) => void;
  isAllSelected: boolean;
  toggleSelectBox: () => void;
  containerHeight: number;
}) {
  return (
    <FlexRow
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        paddingLeft: label ? 12 : 6,
        paddingRight: 6,
        paddingBlock: 4,
        height: containerHeight,
        backgroundColor: '#ffffff',
        boxShadow: '0 0 3px rgba(50, 50, 50, 0.1)',
        border: '1px solid #cccccc',
        borderRadius: 4,
        cursor: 'pointer',
      }}
      onClick={toggleSelectBox}
    >
      <FlexRow style={{ alignItems: 'center', gap: 6, flexGrow: 1 }}>
        {label && (
          <>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 400,
                color: '#333333',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
            <div
              style={{ height: 20, width: 1, alignSelf: 'center', backgroundColor: '#cccccc' }}
            ></div>
          </>
        )}
        {isAllSelected ? (
          <FlexRow
            style={{
              flexGrow: 1,
              width: '100%',
              paddingBlock: 2,
              paddingInline: 6,
              borderRadius: 4,
              border: '1px solid #cccccc',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary[300],
              gap: 6,
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: '1rem',
                color: '#ffffff',
              }}
            >
              전체
            </span>
          </FlexRow>
        ) : (
          <>
            {selectedOptions.map((selectedOption, index) => {
              return (
                <FlexRow
                  key={index}
                  style={{
                    paddingBlock: 2,
                    paddingInline: 6,
                    minWidth: 30,
                    borderRadius: 4,
                    border: '1px solid #cccccc',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.primary[300],
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: '#ffffff',
                    }}
                  >
                    {selectedOption.label}
                  </span>
                  <CloseIcon
                    style={{ fontSize: '1rem', color: '#ffffff', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteValue(selectedOption);
                    }}
                  />
                </FlexRow>
              );
            })}
          </>
        )}
      </FlexRow>
      <FlexRow
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
        }}
      >
        <KeyboardArrowDownIcon style={{ fontSize: '1.4rem' }} />
      </FlexRow>
    </FlexRow>
  );
}

function SelectItems<ValuesType extends (string | number)[]>({
  selectValue,
  selectedValues,
  options,
}: {
  selectValue: (value: ValuesType) => void;
  selectedValues: ValuesType;
  options: SelectOption[];
}) {
  return (
    <div
      className='shadow-scroll'
      style={{
        position: 'absolute',
        top: '115%',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: 4,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxHeight: 300,
        overflowY: 'auto',
        zIndex: SELECT_BOX_ITEM_Z_INDEX,
      }}
    >
      {options.map((option) => (
        <FlexRow
          key={option.value}
          style={{
            alignItems: 'center',
            height: 38,
            cursor: 'pointer',
            backgroundColor: selectedValues.includes(option.value) ? '#ececec' : 'transparent',
          }}
          onClick={() => {
            if (selectedValues.includes(option.value)) {
              selectValue(selectedValues.filter((value) => value !== option.value) as ValuesType);
            } else {
              selectValue([...selectedValues, option.value] as ValuesType);
            }
          }}
        >
          <span
            style={{
              marginLeft: 4,
              padding: '2px 8px',
              borderRadius: 4,
              color: '#000000',
            }}
          >
            {option.label}
          </span>
        </FlexRow>
      ))}
    </div>
  );
}
