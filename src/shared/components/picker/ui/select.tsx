import { ReactNode, useMemo, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { FlexRow } from '@/shared/components';

type SelectOption<ValueType extends string | number> = {
  label: ReactNode;
  value: ValueType;
};

export function Select<ValueType extends string | number>({
  label = '',
  value,
  onChange,
  options,
  containerWidth,
  containerMinWidth = 160,
  containerHeight = 38,
}: {
  label?: string;
  value: ValueType;
  onChange: (value: ValueType) => void;
  options: SelectOption<ValueType>[];
  containerWidth?: string | number;
  containerMinWidth?: string | number;
  containerHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useHandleClickOutsideRef({
    condition: isOpen,
    outsideClickAction: () => setIsOpen(false),
  });

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label || '',
    [options, value],
  );

  const toggleSelectBox = () => setIsOpen(!isOpen);

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
        selectedLabel={selectedLabel}
        toggleSelectBox={toggleSelectBox}
        containerHeight={containerHeight}
      />
      {isOpen && (
        <SelectItems
          options={options}
          selectedValue={value}
          selectValue={(newValue) => {
            onChange(newValue);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SelectContainer({
  label,
  isOpen,
  selectedLabel,
  toggleSelectBox,
  containerHeight,
}: {
  label?: string;
  isOpen: boolean;
  selectedLabel?: ReactNode;
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
      <FlexRow style={{ alignItems: 'center', gap: 8 }}>
        {label && (
          <>
            <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#333333' }}>{label}</span>
            <div
              style={{ height: 20, width: 1, alignSelf: 'center', backgroundColor: '#cccccc' }}
            ></div>
          </>
        )}
        <span
          style={{
            padding: '3px 9px',
            borderRadius: 4,
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {selectedLabel}
        </span>
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

function SelectItems<ValueType extends string | number>({
  selectValue,
  selectedValue,
  options,
}: {
  selectValue: (value: ValueType) => void;
  selectedValue: ValueType;
  options: SelectOption<ValueType>[];
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
            backgroundColor: selectedValue === option.value ? '#e9e9e9' : 'transparent',
          }}
          onClick={() => selectValue(option.value)}
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
