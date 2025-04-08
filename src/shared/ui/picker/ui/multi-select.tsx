import type { CSSProperties, HTMLProps, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReferenceType, Strategy, VirtualElement, Placement } from '@floating-ui/react';
import {
  flip,
  FloatingOverlay,
  FloatingPortal,
  offset,
  size,
  useClick,
  useFloating,
  useInteractions,
} from '@floating-ui/react';

import { HiChevronUpDown } from 'react-icons/hi2';
import CloseIcon from '@mui/icons-material/Close';
import { FiSearch } from 'react-icons/fi';

import { colors, zIndex } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { Checkbox, FlexRow, Input, InputStyle, Typography } from '@/shared/ui';
import type { MultiSelectOption } from '../model';

export function MultiSelect<ValuesType extends (string | number)[]>({
  strategy = 'absolute',
  placement = 'bottom',
  label = '',
  values,
  onChange,
  options,
  containerWidth,
  containerMinWidth = '10rem',
  containerHeight = '2rem',
  isAutocomplete = false,
  openListener,
}: {
  strategy?: Strategy;
  placement?: Placement;
  label?: string;
  values: ValuesType;
  onChange: (value: ValuesType) => void;
  options: MultiSelectOption[];
  containerWidth?: string | number;
  containerMinWidth?: string | number;
  containerHeight?: string | number;
  isAutocomplete?: boolean;
  openListener?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openListener) {
      openListener(isOpen);
    }
  }, [isOpen]);

  const ref = useHandleClickOutsideRef<HTMLDivElement>({
    condition: isOpen,
    outsideClickAction: () => {
      if (strategy === 'absolute') {
        setIsOpen(false);
      }
    },
  });

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy,
    placement,
    transform: false,
    middleware: [
      offset({
        mainAxis: 4,
      }),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
            // maxWidth: `${rects.reference.width}px`,
          });
        },
        padding: 10,
      }),
    ],
  });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

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

  const handleFilterText = (newFilterText: string) => {
    setFilterText(newFilterText);
    if (!isOpen) {
      setIsOpen(true);
    }
    setHighlightedIndex(null);
  };

  const getFilteredOptions = () => {
    if (!isAutocomplete) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterText.toLowerCase()),
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (highlightedIndex === null) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev !== null && getFilteredOptions().length - 1 !== prev
            ? Math.min(prev + 1, getFilteredOptions().length - 1)
            : 0,
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (highlightedIndex === 0) {
        setHighlightedIndex(getFilteredOptions().length - 1);
      } else {
        setHighlightedIndex((prev) => (prev !== null ? Math.max(prev - 1, 0) : 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex !== null && getFilteredOptions()[highlightedIndex]) {
        const isExist = values.includes(getFilteredOptions()[highlightedIndex].value);

        if (isExist) {
          onChange(
            values.filter(
              (value) => value !== getFilteredOptions()[highlightedIndex].value,
            ) as ValuesType,
          );
        } else {
          onChange([...values, getFilteredOptions()[highlightedIndex].value] as ValuesType);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

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
        ref={refs.setReference}
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
        getReferenceProps={getReferenceProps}
      />
      <AnimatePresence>
        {isOpen &&
          (strategy === 'fixed' ? (
            <FloatingPortal>
              <FloatingOverlay
                lockScroll
                style={{ zIndex: zIndex.anchorOverlay }}
                onClick={() => {
                  setIsOpen(false);
                }}
              />
              <SelectItems
                setFloating={refs.setFloating}
                floatingStyles={floatingStyles}
                getFloatingProps={getFloatingProps}
                options={getFilteredOptions()}
                selectedValues={values}
                selectValue={(newValues) => {
                  onChange(newValues);
                }}
                isAutocomplete={isAutocomplete}
                filterText={filterText}
                handleFilterText={handleFilterText}
                handleKeyDown={handleKeyDown}
                highlightedIndex={highlightedIndex}
              />
            </FloatingPortal>
          ) : (
            <SelectItems
              setFloating={refs.setFloating}
              floatingStyles={floatingStyles}
              getFloatingProps={getFloatingProps}
              options={getFilteredOptions()}
              selectedValues={values}
              selectValue={(newValues) => {
                onChange(newValues);
              }}
              isAutocomplete={isAutocomplete}
              filterText={filterText}
              handleFilterText={handleFilterText}
              handleKeyDown={handleKeyDown}
              highlightedIndex={highlightedIndex}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

function SelectContainer({
  ref,
  label,
  selectedOptions = [],
  deleteValue,
  isAllSelected,
  toggleSelectBox,
  containerWidth,
  containerHeight,
  getReferenceProps,
}: {
  ref?: ((node: ReferenceType | null) => void) & ((node: Element | VirtualElement | null) => void);
  label?: string;
  selectedOptions: MultiSelectOption[];
  deleteValue: (option: MultiSelectOption) => void;
  isAllSelected: boolean;
  toggleSelectBox: () => void;
  containerWidth?: string | number;
  containerHeight: string | number;
  getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
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
      ref={ref}
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
      {...getReferenceProps()}
    >
      <FlexRow
        ref={selectedOptionsContainerRef}
        style={{ alignItems: 'center', gap: 6, flexGrow: 1 }}
      >
        {label && (
          <>
            <Typography
              style={{
                fontSize: '0.8rem',
                fontWeight: 400,
                color: '#333333',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
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
            <Typography
              style={{
                fontWeight: 600,
                fontSize: '0.92rem',
                color: '#ffffff',
              }}
            >
              전체
            </Typography>
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
                  <Typography
                    style={{
                      fontWeight: 500,
                      fontSize: '0.92rem',
                      color: '#ffffff',
                    }}
                  >
                    {selectedOption.label}
                  </Typography>
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
  setFloating,
  floatingStyles,
  getFloatingProps,
  selectValue,
  selectedValues,
  options,
  isAutocomplete,
  filterText,
  handleFilterText,
  handleKeyDown,
  highlightedIndex,
}: {
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  selectValue: (value: ValuesType) => void;
  selectedValues: ValuesType;
  options: MultiSelectOption[];
  isAutocomplete: boolean;
  filterText: string;
  handleFilterText: (text: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  highlightedIndex: number | null;
}) {
  return (
    <motion.div
      ref={setFloating}
      className='shadow-scroll'
      style={{
        ...{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: 4,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          maxHeight: 300,
          overflowY: 'auto',
          zIndex: zIndex.selectBoxItem,
          padding: 6,
        },
        ...floatingStyles,
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
      {...getFloatingProps()}
    >
      {isAutocomplete && (
        <Input
          onKeyDown={handleKeyDown}
          startDecorator={<FiSearch style={{ color: '#999999', fontSize: '1.1rem' }} />}
          inputStyle={InputStyle.UNDERLINE}
          value={filterText}
          onChange={(event) => {
            handleFilterText(event.target.value);
          }}
          onClick={(event) => event.stopPropagation()}
          isFocusEffect={false}
          style={{ width: '100%', backgroundColor: 'transparent', height: 32, marginBottom: 6 }}
          placeholder={'Search Option'}
        />
      )}
      {options.map((option, index) => (
        <FlexRow
          as={motion.div}
          key={option.value}
          style={{
            alignItems: 'center',
            height: 38,
            cursor: 'pointer',
            paddingInline: 8,
            paddingBlock: 2,
            backgroundColor: highlightedIndex === index ? '#f4f4f4' : '#ffffff',
            borderRadius: 6,
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
          whileHover={{ backgroundColor: '#f4f4f4' }}
        >
          <Checkbox
            checked={selectedValues.includes(option.value)}
            onClick={(e) => e.preventDefault()}
          />
          <Typography
            style={{
              fontSize: '0.94rem',
              padding: '2px 8px',
              borderRadius: 4,
              color: '#000000',
            }}
          >
            {option.label}
          </Typography>
        </FlexRow>
      ))}
    </motion.div>
  );
}
