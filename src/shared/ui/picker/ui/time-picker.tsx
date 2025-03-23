import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  flip,
  FloatingOverlay,
  FloatingPortal,
  offset,
  Placement,
  size,
  Strategy,
  useClick,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { format, parse, setHours, setMinutes, setSeconds } from 'date-fns';

import { MdOutlineAccessTime } from 'react-icons/md';

import { zIndex } from '@/shared/constants';
import { FlexColumn, FlexRow, Input } from '@/shared/ui';
import { TimePart } from '../model/picker-type.ts';

export function TimePicker({
  timeString,
  onChange,
  strategy = 'absolute',
  placement = 'bottom-start',
  width = 'auto',
  displayParts = ['hours', 'minutes'],
  timeFormat = 'HH:mm',
}: {
  timeString?: string;
  onChange?: (timeString: string) => void;
  strategy?: Strategy;
  placement?: Placement;
  width?: string | number;
  displayParts?: TimePart[];
  timeFormat?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((prev) => !prev);

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

  const [innerTimeValue, setInnerTimeValue] = useState<Date>(() => {
    return timeString ? parse(timeString, timeFormat, new Date()) : new Date();
  });

  const innerTimeValueString = innerTimeValue ? format(innerTimeValue, timeFormat) : '';

  const handlePartChange = (part: TimePart, value: number) => {
    let updatedTime = innerTimeValue;
    if (part === 'hours') {
      updatedTime = setHours(updatedTime, value);
    } else if (part === 'minutes') {
      updatedTime = setMinutes(updatedTime, value);
    } else if (part === 'seconds') {
      updatedTime = setSeconds(updatedTime, value);
    }
    setInnerTimeValue(updatedTime);
    onChange?.(format(updatedTime, timeFormat));
  };

  return (
    <>
      <FlexRow ref={refs.setReference} {...getReferenceProps()}>
        <Input
          style={{ width: width !== 'auto' ? width : 160, cursor: 'pointer' }}
          value={innerTimeValueString}
          onClick={toggleIsOpen}
          readOnly
          endDecorator={<MdOutlineAccessTime style={{ fontSize: '1.2rem' }} />}
        />
      </FlexRow>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <FloatingOverlay
              lockScroll
              style={{ zIndex: zIndex.anchorOverlay }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={refs.setFloating}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              style={{
                ...{ zIndex: zIndex.anchor, transformOrigin: 'top left' },
                ...floatingStyles,
              }}
              {...getFloatingProps()}
            >
              <FlexRow
                style={{
                  height: 300,
                  maxHeight: 300,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                }}
              >
                {displayParts.includes('hours') && (
                  <TimeList
                    timeValue={innerTimeValue}
                    handlePartChange={handlePartChange}
                    part={'hours'}
                    formatStr={'HH'}
                    max={24}
                  />
                )}
                {displayParts.includes('minutes') && (
                  <TimeList
                    timeValue={innerTimeValue}
                    handlePartChange={handlePartChange}
                    part={'minutes'}
                    formatStr={'mm'}
                    max={60}
                  />
                )}
                {displayParts.includes('seconds') && (
                  <TimeList
                    timeValue={innerTimeValue}
                    handlePartChange={handlePartChange}
                    part={'seconds'}
                    formatStr={'ss'}
                    max={60}
                  />
                )}
              </FlexRow>
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}

const pad = (num: number) => String(num).padStart(2, '0');

function TimeList({
  timeValue,
  handlePartChange,
  formatStr,
  part,
  max,
}: {
  timeValue: Date;
  handlePartChange: (part: TimePart, value: number) => void;
  formatStr: string;
  part: TimePart;
  max: number;
}) {
  return (
    <FlexColumn
      style={{
        userSelect: 'none',
        width: 100,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {Array.from({ length: max }, (_, i) => i).map((num) => {
        const formatted = pad(num);
        const currentValue = format(timeValue, formatStr);
        const isSelected = currentValue === formatted;
        return (
          <FlexRow
            as={motion.div}
            key={num}
            onClick={() => handlePartChange(part, num)}
            style={{
              paddingInline: 8,
              paddingBlock: 4,
              backgroundColor: isSelected ? '#eaeaea' : '#ffffff',
              cursor: 'pointer',
            }}
            variants={{
              hover: { backgroundColor: '#f4f4f4' },
              none: {},
            }}
            whileHover={isSelected ? 'none' : 'hover'}
            transition={{ duration: 0.1 }}
          >
            {formatted}
          </FlexRow>
        );
      })}
    </FlexColumn>
  );
}
