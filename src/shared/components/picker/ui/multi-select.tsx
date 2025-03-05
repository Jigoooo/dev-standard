import { ReactNode, useEffect, useRef, useState } from 'react';

import { HiChevronUpDown } from 'react-icons/hi2';
import CloseIcon from '@mui/icons-material/Close';

import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { Checkbox, FlexRow } from '@/shared/components';
import { AnimatePresence, motion } from 'framer-motion';

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

  const selectedOptions = options
    .filter((option) => values.includes(option.value))
    .map((option) => option);

  const toggleSelectBox = () => setIsOpen(!isOpen);

  const isAllSelected = selectedOptions.length === 0 || selectedOptions.length === options.length;

  useEffect(() => {
    if (isAllSelected) {
      onChange([...options.map((option) => option.value)] as ValuesType);
    }
  }, [isAllSelected]);

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
        selectedOptions={selectedOptions}
        deleteValue={(option) => {
          onChange(values.filter((value) => value !== option.value) as ValuesType);

          if (values.length === 0) {
            onChange([...options.map((option) => option.value)] as ValuesType);
          }
        }}
        isAllSelected={isAllSelected}
        toggleSelectBox={toggleSelectBox}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
      <AnimatePresence>
        {isOpen && (
          <SelectItems
            options={options}
            selectedValues={values}
            selectValue={(newValues) => {
              onChange(newValues);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectContainer({
  label,
  selectedOptions = [],
  deleteValue,
  isAllSelected,
  toggleSelectBox,
  containerWidth,
  containerHeight,
}: {
  label?: string;
  selectedOptions: SelectOption[];
  deleteValue: (option: SelectOption) => void;
  isAllSelected: boolean;
  toggleSelectBox: () => void;
  containerWidth?: string | number;
  containerHeight: number;
}) {
  const selectedOptionsContainerRef = useRef<HTMLDivElement>(null);
  const [optionsContainerWidth, setOptionsContainerWidth] = useState(0);

  useEffect(() => {
    if (selectedOptionsContainerRef.current) {
      setOptionsContainerWidth(selectedOptionsContainerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (selectedOptionsContainerRef.current) {
        setOptionsContainerWidth(selectedOptionsContainerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FlexRow
      as={motion.div}
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
        overflow: 'hidden',
      }}
      onClick={toggleSelectBox}
      whileHover={{ backgroundColor: '#f4f4f4' }}
      transition={{ duration: 0.14 }}
    >
      <FlexRow
        ref={selectedOptionsContainerRef}
        style={{ alignItems: 'center', gap: 6, flexGrow: 1 }}
      >
        {label && (
          <>
            <span
              style={{
                fontSize: '0.84rem',
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
                fontWeight: 600,
                fontSize: '0.92rem',
                color: '#ffffff',
              }}
            >
              전체
            </span>
          </FlexRow>
        ) : (
          <FlexRow
            className={'no-scrollbar'}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              maxWidth:
                containerWidth && optionsContainerWidth
                  ? `${optionsContainerWidth - 120}px`
                  : '100%',
              gap: 4,
            }}
          >
            {selectedOptions.map((selectedOption, index) => {
              return (
                <FlexRow
                  key={index}
                  style={{
                    paddingBlock: 1,
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
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: '#ffffff',
                    }}
                  >
                    {selectedOption.label}
                  </span>
                  <CloseIcon
                    style={{ fontSize: '0.94rem', color: '#ffffff', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteValue(selectedOption);
                    }}
                  />
                </FlexRow>
              );
            })}
          </FlexRow>
        )}
      </FlexRow>
      <FlexRow
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HiChevronUpDown style={{ fontSize: '1.3rem', color: '#888888' }} />
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
    <motion.div
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
        transformOrigin: 'top center',
      }}
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      transition={{ duration: 0.14, ease: 'easeInOut' }}
    >
      {options.map((option) => (
        <FlexRow
          key={option.value}
          style={{
            alignItems: 'center',
            height: 38,
            cursor: 'pointer',
            paddingLeft: 10,
            paddingRight: 6,
            paddingBlock: 2,
            // backgroundColor: selectedValues.includes(option.value) ? '#ececec' : 'transparent',
          }}
          onClick={() => {
            if (selectedValues.includes(option.value)) {
              selectValue(selectedValues.filter((value) => value !== option.value) as ValuesType);
            } else {
              selectValue([...selectedValues, option.value] as ValuesType);
            }

            if (selectedValues.length === 0) {
              selectValue([...options.map((option) => option.value)] as ValuesType);
            }
          }}
        >
          <Checkbox
            checked={selectedValues.includes(option.value)}
            onClick={(e) => e.preventDefault()}
          />
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              color: '#000000',
            }}
          >
            {option.label}
          </span>
        </FlexRow>
      ))}
    </motion.div>
  );
}
