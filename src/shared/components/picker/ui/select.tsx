import { useMemo, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { FlexRow, Input } from '@/shared/components';

type SelectOption<ValueType extends string | number> = {
  label: string;
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
  isAutocomplete = false,
}: {
  label?: string;
  value: ValueType;
  onChange: (value: ValueType) => void;
  options: SelectOption<ValueType>[];
  containerWidth?: string | number;
  containerMinWidth?: string | number;
  containerHeight?: number;
  isAutocomplete?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const ref = useHandleClickOutsideRef({
    condition: isOpen,
    outsideClickAction: () => setIsOpen(false),
  });

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label || '',
    [options, value],
  );

  const toggleSelectBox = () => {
    if (!isOpen && isAutocomplete) {
      setFilterText('');
      setHighlightedIndex(null);
    }
    setIsOpen(!isOpen);
  };

  const handleFilterText = (newFilterText: string) => {
    setFilterText(newFilterText);
    if (!isOpen) {
      setIsOpen(true);
    }
    setHighlightedIndex(null);
  };

  const filteredOptions = useMemo(() => {
    if (!isAutocomplete) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [options, filterText, isAutocomplete]);

  // const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  //   if (!isOpen) {
  //     if (e.key === 'ArrowDown' || e.key === 'Enter') {
  //       setIsOpen(true);
  //     }
  //     return;
  //   }
  //   if (e.key === 'ArrowDown') {
  //     e.preventDefault();
  //     if (highlightedIndex === null) {
  //       setHighlightedIndex(0);
  //     } else {
  //       setHighlightedIndex((prev) =>
  //         prev !== null ? Math.min(prev + 1, filteredOptions.length - 1) : 0,
  //       );
  //     }
  //   } else if (e.key === 'ArrowUp') {
  //     e.preventDefault();
  //     if (highlightedIndex === 0) {
  //       setHighlightedIndex(filteredOptions.length - 1);
  //     } else {
  //       setHighlightedIndex((prev) => (prev !== null ? Math.max(prev - 1, 0) : 0));
  //     }
  //   } else if (e.key === 'Enter') {
  //     e.preventDefault();
  //     if (highlightedIndex && filteredOptions[highlightedIndex]) {
  //       onChange(filteredOptions[highlightedIndex].value);
  //     }
  //     setIsOpen(false);
  //     setFilterText('');
  //   } else if (e.key === 'Escape') {
  //     setIsOpen(false);
  //   }
  // };

  return (
    <div
      ref={ref}
      // onKeyDown={handleKeyDown}
      // tabIndex={0}
      style={{
        position: 'relative',
        minWidth: containerMinWidth,
        width: containerWidth || 'auto',
        outline: 'none',
      }}
      className='selection-none'
    >
      <SelectContainer
        label={label}
        isOpen={isOpen}
        selectedLabel={selectedLabel}
        isAutocomplete={isAutocomplete}
        filterText={filterText}
        handleFilterText={handleFilterText}
        toggleSelectBox={toggleSelectBox}
        containerHeight={containerHeight}
      />
      {isOpen && (
        <SelectItems
          options={filteredOptions}
          selectedValue={value}
          highlightedIndex={highlightedIndex}
          selectValue={(newValue) => {
            onChange(newValue);
            setIsOpen(false);
            setFilterText('');
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
  isAutocomplete,
  filterText,
  handleFilterText,
  toggleSelectBox,
  containerHeight,
}: {
  label?: string;
  isOpen: boolean;
  selectedLabel?: string;
  isAutocomplete?: boolean;
  filterText: string;
  handleFilterText: (newFilterText: string) => void;
  toggleSelectBox: () => void;
  containerHeight: number;
}) {
  const [isChanged, setIsChanged] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
        border: `2px solid ${isFocused ? colors.primary[400] : '#cccccc'}`,
        transition: 'border-color 0.1s ease',
        borderRadius: 4,
        cursor: 'pointer',
      }}
      onClick={(event) => {
        event.stopPropagation();
        toggleSelectBox();
      }}
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
        {!isAutocomplete ? (
          <span
            style={{
              padding: '3px 6px',
              borderRadius: 4,
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            {selectedLabel}
          </span>
        ) : (
          <Input
            value={isOpen && isChanged ? filterText : selectedLabel}
            onChange={(event) => {
              setIsChanged(true);
              handleFilterText(event.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsChanged(false);
              }, 300);
              setIsFocused(false);
            }}
            onClick={(event) => event.stopPropagation()}
            isFocusEffect={false}
            style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
          />
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

function SelectItems<ValueType extends string | number>({
  selectValue,
  selectedValue,
  options,
  highlightedIndex,
}: {
  selectValue: (value: ValueType) => void;
  selectedValue: ValueType;
  options: SelectOption<ValueType>[];
  highlightedIndex: number | null;
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
      {options.map((option, index) => (
        <FlexRow
          key={option.value}
          style={{
            alignItems: 'center',
            height: 38,
            cursor: 'pointer',
            backgroundColor:
              selectedValue === option.value
                ? colors.primary[50]
                : highlightedIndex && highlightedIndex === index
                  ? '#f0f0f0'
                  : 'transparent',
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
