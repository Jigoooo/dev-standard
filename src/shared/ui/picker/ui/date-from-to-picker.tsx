import { useEffect, useState } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  parse,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Strategy,
  Placement,
  useFloating,
  offset,
  flip,
  size,
  useClick,
  useInteractions,
  FloatingPortal,
  FloatingOverlay,
} from '@floating-ui/react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { FlexRow, Input, Button, FlexColumn, Typography, ButtonStyle } from '@/shared/ui';
import { colors, zIndex } from '@/shared/constants';
import { useHandleClickOutsideRef, useWindowsStyle } from '@/shared/hooks';
import { DateInputField } from './date-input-field.tsx';

type FromToDateString = {
  from: string;
  to: string;
};

type FromToDates = Record<keyof FromToDateString, Date | null>;
type FromToCurrentDates = Record<keyof FromToDateString, Date>;

type TDatePicker = {
  strategy?: Strategy;
  placement?: Placement;
  width?: number | string;
  isInputMode?: boolean;
  fromToDateString?: FromToDateString;
  onChange?: (fromToDateString: FromToDateString) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  openListener?: (isShowDatePicker: boolean) => void;
};

// 헬퍼: 달력에 표시할 날짜 배열 생성
function generateDaysArray(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const daysInMonth = eachDayOfInterval({ start, end });
  const startPaddingDays = Array.from({ length: getDay(start) })
    .map((_, index) => subDays(start, index + 1))
    .reverse();
  const endPaddingDays = Array.from({ length: 6 - getDay(end) }).map((_, index) =>
    addDays(end, index + 1),
  );
  return [...startPaddingDays, ...daysInMonth, ...endPaddingDays];
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜 피커 훅 (선택 날짜, 현재 표시 월 등 관리)
function useDateFromToPicker({
  fromToDateString,
  onChange,
  dateFormat,
}: {
  fromToDateString?: FromToDateString;
  onChange?: (fromToDateString: FromToDateString) => void;
  dateFormat: string;
}) {
  const [selectedFromToDate, setSelectedFromToDate] = useState<FromToDates>({
    from:
      fromToDateString && isValid(parse(fromToDateString.from, dateFormat, new Date()))
        ? parse(fromToDateString.from, dateFormat, new Date())
        : null,
    to:
      fromToDateString && isValid(parse(fromToDateString.to, dateFormat, new Date()))
        ? parse(fromToDateString.to, dateFormat, new Date())
        : null,
  });

  const [showFromToDatePicker, setShowFromToDatePicker] = useState(false);
  const [currentFromToDate, setCurrentFromToDate] = useState<FromToCurrentDates>({
    from:
      fromToDateString && isValid(parse(fromToDateString.from, dateFormat, new Date()))
        ? parse(fromToDateString.from, dateFormat, new Date())
        : new Date(),
    to:
      fromToDateString && isValid(parse(fromToDateString.to, dateFormat, new Date()))
        ? parse(fromToDateString.to, dateFormat, new Date())
        : addMonths(new Date(), 1),
  });

  useEffect(() => {
    if (fromToDateString) {
      const fromDate = parse(fromToDateString.from, dateFormat, new Date());
      const toDate = parse(fromToDateString.to, dateFormat, new Date());

      if (isValid(fromDate) && isValid(toDate)) {
        setSelectedFromToDate({
          from: fromDate,
          to: toDate,
        });
      }
    }
  }, [fromToDateString, dateFormat]);

  const handleDateClick = (date: Date) => {
    if (!selectedFromToDate.from || (selectedFromToDate.from && selectedFromToDate.to)) {
      setSelectedFromToDate({ from: date, to: null });
      onChange?.({
        from: date ? format(date, dateFormat) : '',
        to: '',
      });
    } else {
      if (isBefore(date, selectedFromToDate.from)) {
        setSelectedFromToDate({ from: date, to: null });
        onChange?.({
          from: date ? format(date, dateFormat) : '',
          to: fromToDateString?.to ?? '',
        });
      } else {
        setShowFromToDatePicker(false);

        setSelectedFromToDate((prevState) => ({ ...prevState, to: date }));
        onChange?.({
          from: fromToDateString?.from ?? '',
          to: date ? format(date, dateFormat) : '',
        });
      }
    }
  };

  const handleDateInput = (pickerType: 'from' | 'to', newDateString: string) => {
    const parsedDate = parse(newDateString, dateFormat, new Date());
    if (!isValid(parsedDate)) {
      console.error('유효하지 않은 날짜 형식입니다.');
      // 여기서 별도의 피드백을 주거나, 입력 필드를 기존 날짜로 복원하도록 할 수 있습니다.
      return;
    }
    if (pickerType === 'from') {
      if (selectedFromToDate.to && isAfter(parsedDate, selectedFromToDate.to)) {
        console.error('시작 날짜는 종료 날짜보다 클 수 없습니다.');
        return;
      }
      setSelectedFromToDate((prev) => ({ ...prev, from: parsedDate }));
      onChange?.({
        from: format(parsedDate, dateFormat),
        to: selectedFromToDate.to ? format(selectedFromToDate.to, dateFormat) : '',
      });
    } else {
      // pickerType === 'to'
      if (selectedFromToDate.from && isBefore(parsedDate, selectedFromToDate.from)) {
        console.error('종료 날짜는 시작 날짜보다 작을 수 없습니다.');
        return;
      }
      setSelectedFromToDate((prev) => ({ ...prev, to: parsedDate }));
      onChange?.({
        from: selectedFromToDate.from ? format(selectedFromToDate.from, dateFormat) : '',
        to: format(parsedDate, dateFormat),
      });
    }
  };

  const handlePrevFromMonth = () => {
    setCurrentFromToDate((prevState) => ({
      ...prevState,
      from: subMonths(prevState.from, 1),
    }));
  };

  const handleNextFromMonth = () => {
    const newFrom = addMonths(currentFromToDate.from, 1);

    if (!isBefore(newFrom, currentFromToDate.to)) {
      return;
    }

    setCurrentFromToDate((prevState) => ({ ...prevState, from: newFrom }));
  };

  // 달력 이동 핸들러 (to 달력)
  const handlePrevToMonth = () => {
    const newTo = subMonths(currentFromToDate.to, 1);
    if (!isAfter(newTo, currentFromToDate.from)) {
      return;
    }

    setCurrentFromToDate((prevState) => ({ ...prevState, to: newTo }));
  };

  const handleNextToMonth = () => {
    setCurrentFromToDate((prevState) => ({ ...prevState, to: addMonths(prevState.to, 1) }));
  };

  return {
    selectedFromToDate,
    showFromToDatePicker,
    setShowFromToDatePicker,
    setSelectedFromToDate,
    currentFromToDate,
    handleDateClick,
    handleDateInput,
    handlePrevFromMonth,
    handlePrevToMonth,
    handleNextFromMonth,
    handleNextToMonth,
  };
}

type FromToPickerProps = {
  pickerType: 'from' | 'to';
  selectedFromToDate: FromToDates;
  currentFromToDate: FromToCurrentDates;
  handleDateClick: (date: Date) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  selectedDate: Date | null;
  currentDate: Date;
  minDate?: Date;
  maxDate?: Date;
};

// 날짜 셀의 스타일 계산 헬퍼 함수들
function getCellBorderRadius(
  day: Date | null,
  selectedDate: Date | null,
  selectedFromToDate: FromToDates,
): number {
  if (!day) return 0;
  if (selectedDate && isEqual(day, selectedDate)) {
    return 6;
  }
  if (
    (selectedFromToDate?.from && isEqual(day, selectedFromToDate.from)) ||
    (selectedFromToDate?.to && isEqual(day, selectedFromToDate.to))
  ) {
    return 6;
  }
  return 0;
}
function getCellBackgroundColor(
  day: Date | null,
  selectedDate: Date | null,
  selectedFromToDate: FromToDates,
): string {
  if (!day) return 'transparent';
  if (selectedDate && isEqual(day, selectedDate)) {
    return colors.primary[500];
  }
  if (
    selectedFromToDate?.from &&
    selectedFromToDate?.to &&
    isAfter(day, selectedFromToDate.from) &&
    isBefore(day, selectedFromToDate.to)
  ) {
    return 'rgba(67, 122, 220, 0.1)';
  }
  if (
    (selectedFromToDate?.from && isEqual(day, selectedFromToDate.from)) ||
    (selectedFromToDate?.to && isEqual(day, selectedFromToDate.to))
  ) {
    return colors.primary[500];
  }
  return '#ffffff';
}
function getCellTextColor(
  day: Date | null,
  selectedDate: Date | null,
  selectedFromToDate: FromToDates,
  isCurrentMonth: boolean,
  isDisabled: boolean,
): string {
  if (!day) return 'transparent';
  if (isDisabled) return 'grey';
  if (selectedDate && isEqual(day, selectedDate)) {
    return 'white';
  }
  if (
    (selectedFromToDate?.from && isEqual(day, selectedFromToDate.from)) ||
    (selectedFromToDate?.to && isEqual(day, selectedFromToDate.to))
  ) {
    return 'white';
  }
  return isCurrentMonth ? '#333333' : 'lightgrey';
}

// Picker 컴포넌트: 달력 렌더링
function FromToPicker({
  pickerType,
  selectedFromToDate,
  currentFromToDate,
  handleDateClick,
  handlePrevMonth,
  handleNextMonth,
  selectedDate,
  currentDate,
  minDate,
  maxDate,
}: FromToPickerProps) {
  const windowsStyle = useWindowsStyle();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateDaysArray(year, month);
  const isSameMonth = (date: Date) => date.getMonth() === month;

  let disablePrev = false;
  let disableNext = false;
  if (pickerType === 'from') {
    if (minDate && isBefore(subMonths(currentFromToDate.from, 1), minDate)) {
      disablePrev = true;
    }
    if (!isBefore(addMonths(currentFromToDate.from, 1), currentFromToDate.to)) {
      disableNext = true;
    }
  } else {
    if (maxDate && isAfter(currentFromToDate.to, maxDate)) {
      disableNext = true;
    }
    if (!isAfter(subMonths(currentFromToDate.to, 1), currentFromToDate.from)) {
      disablePrev = true;
    }
  }

  const handlePaddingDateClick = (date: Date) => {
    if (isBefore(date, startOfMonth(new Date(year, month)))) {
      handlePrevMonth();
    } else {
      handleNextMonth();
    }
    handleDateClick(date);
  };

  return (
    <div
      className={'selection-none'}
      style={{
        marginTop: 8,
        paddingBlock: 12,
        paddingInline: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        width: 250,
      }}
    >
      <FlexRow style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button
          buttonStyle={ButtonStyle.OUTLINED}
          style={{ height: 30, paddingInline: 6, color: '#bbbbbb', borderColor: '#e4e4e4' }}
          onClick={handlePrevMonth}
          disabled={disablePrev}
        >
          <ArrowBackIcon style={{ fontSize: '1rem', color: disablePrev ? '#cccccc' : '#666666' }} />
        </Button>
        <Typography style={{ fontSize: '0.96rem', fontWeight: 600, lineHeight: 2 }}>
          {format(currentDate, 'yyyy년 MMMM', { locale: ko })}
        </Typography>
        <Button
          buttonStyle={ButtonStyle.OUTLINED}
          style={{ height: 30, paddingInline: 6, color: '#bbbbbb', borderColor: '#e4e4e4' }}
          onClick={handleNextMonth}
          disabled={disableNext}
        >
          <ArrowForwardIcon
            style={{ fontSize: '1rem', color: disableNext ? 'lightgrey' : '#666666' }}
          />
        </Button>
      </FlexRow>
      <FlexRow style={{ width: '100%', justifyContent: 'space-around', marginBottom: 8 }}>
        {weekDays.map((day) => (
          <div key={day}>
            <Typography style={{ fontSize: '1rem', fontWeight: 700 }}>{day}</Typography>
          </div>
        ))}
      </FlexRow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 8 }}>
        {days.map((day, index) => {
          const isDisabled =
            !!day &&
            ((minDate ? isBefore(day, minDate) : false) ||
              (maxDate ? isAfter(day, maxDate) : false));
          const currentMonth = !!day && isSameMonth(day);
          const borderRadius = getCellBorderRadius(day, selectedDate, selectedFromToDate);
          const backgroundColor = getCellBackgroundColor(day, selectedDate, selectedFromToDate);
          const textColor = getCellTextColor(
            day,
            selectedDate,
            selectedFromToDate,
            currentMonth,
            isDisabled,
          );
          return (
            <div key={index} style={{ gridColumn: 'span 1' }}>
              <div
                onClick={() => {
                  if (day && !isDisabled) {
                    if (currentMonth) {
                      handleDateClick(day);
                    } else {
                      handlePaddingDateClick(day);
                    }
                  }
                }}
                style={{
                  ...{
                    textAlign: 'center',
                    cursor: day && !isDisabled ? 'pointer' : undefined,
                    paddingBlock: 4,
                    borderRadius,
                    backgroundColor,
                    color: textColor,
                    position: 'relative',
                    fontSize: '0.9rem',
                  },
                  ...windowsStyle,
                }}
              >
                {day ? format(day, 'd') : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateFromToPicker({
  strategy = 'absolute',
  placement = 'bottom-start',
  width = 'auto',
  isInputMode = false,
  fromToDateString,
  onChange,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  openListener,
}: TDatePicker) {
  const {
    selectedFromToDate,
    showFromToDatePicker,
    setShowFromToDatePicker,
    setSelectedFromToDate,
    currentFromToDate,
    handleDateClick,
    handleDateInput,
    handlePrevFromMonth,
    handlePrevToMonth,
    handleNextFromMonth,
    handleNextToMonth,
  } = useDateFromToPicker({ fromToDateString, onChange, dateFormat });

  const outsideClickAction = () => {
    if (!selectedFromToDate.to) {
      setSelectedFromToDate((prevState) => {
        return {
          ...prevState,
          to: selectedFromToDate.from,
        };
      });
    }

    setShowFromToDatePicker(false);
  };

  const datePickerRef = useHandleClickOutsideRef({
    condition: showFromToDatePicker,
    outsideClickAction: () => {
      if (strategy === 'absolute') {
        outsideClickAction();
      }
    },
  });

  useEffect(() => {
    if (openListener) {
      openListener(showFromToDatePicker);
    }
  }, [showFromToDatePicker]);

  const { refs, floatingStyles, context } = useFloating({
    open: showFromToDatePicker,
    onOpenChange: setShowFromToDatePicker,
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

  const handleInputClick = () => setShowFromToDatePicker((prev) => !prev);
  const inputSelectedFromDateString = selectedFromToDate.from
    ? format(selectedFromToDate.from, dateFormat)
    : '';
  const inputSelectedToDateString = selectedFromToDate.to
    ? format(selectedFromToDate.to, dateFormat)
    : '';

  return (
    <FlexColumn ref={datePickerRef} style={{ position: 'relative', width }}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {!isInputMode ? (
          <FlexRow style={{ gap: 6 }}>
            <Input
              style={{ width: 160, cursor: 'pointer' }}
              value={inputSelectedFromDateString}
              onClick={handleInputClick}
              readOnly
              endDecorator={<CalendarMonthIcon style={{ fontSize: '1.2rem' }} />}
              isFocusEffect={false}
            />
            <Input
              style={{ width: 160, cursor: 'pointer' }}
              value={inputSelectedToDateString}
              onClick={handleInputClick}
              readOnly
              endDecorator={<CalendarMonthIcon style={{ fontSize: '1.2rem' }} />}
              isFocusEffect={false}
            />
          </FlexRow>
        ) : (
          <FlexRow style={{ gap: 6 }}>
            <DateInputField
              selectedDate={selectedFromToDate.from}
              handleDateClick={(date) => {
                handleDateInput('from', format(date, dateFormat));
              }}
              handleInputClick={handleInputClick}
              minDate={minDate}
              maxDate={maxDate}
            />
            <DateInputField
              selectedDate={selectedFromToDate.to}
              handleDateClick={(date) => {
                handleDateInput('to', format(date, dateFormat));
              }}
              handleInputClick={handleInputClick}
              minDate={minDate}
              maxDate={maxDate}
            />
          </FlexRow>
        )}
      </div>
      {showFromToDatePicker &&
        (strategy === 'fixed' ? (
          <FloatingPortal>
            <FloatingOverlay
              lockScroll
              style={{ zIndex: zIndex.anchorOverlay }}
              onClick={outsideClickAction}
            />
            <FlexRow
              ref={refs.setFloating}
              style={{
                ...{
                  zIndex: zIndex.anchorOverlay,
                  gap: 8,
                },
                ...floatingStyles,
              }}
              {...getFloatingProps()}
            >
              <FromToPicker
                pickerType={'from'}
                selectedFromToDate={selectedFromToDate}
                currentFromToDate={currentFromToDate}
                handleDateClick={handleDateClick}
                handlePrevMonth={handlePrevFromMonth}
                handleNextMonth={handleNextFromMonth}
                selectedDate={selectedFromToDate.from}
                currentDate={currentFromToDate.from}
                minDate={minDate ? subDays(minDate, 1) : undefined}
                maxDate={maxDate}
              />
              <FromToPicker
                pickerType={'to'}
                selectedFromToDate={selectedFromToDate}
                currentFromToDate={currentFromToDate}
                handleDateClick={handleDateClick}
                handlePrevMonth={handlePrevToMonth}
                handleNextMonth={handleNextToMonth}
                selectedDate={selectedFromToDate.to}
                currentDate={currentFromToDate.to}
                minDate={minDate ? subDays(minDate, 1) : undefined}
                maxDate={maxDate}
              />
            </FlexRow>
          </FloatingPortal>
        ) : (
          <FlexRow
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1,
              gap: 8,
            }}
          >
            <FromToPicker
              pickerType={'from'}
              selectedFromToDate={selectedFromToDate}
              currentFromToDate={currentFromToDate}
              handleDateClick={handleDateClick}
              handlePrevMonth={handlePrevFromMonth}
              handleNextMonth={handleNextFromMonth}
              selectedDate={selectedFromToDate.from}
              currentDate={currentFromToDate.from}
              minDate={minDate ? subDays(minDate, 1) : undefined}
              maxDate={maxDate}
            />
            <FromToPicker
              pickerType={'to'}
              selectedFromToDate={selectedFromToDate}
              currentFromToDate={currentFromToDate}
              handleDateClick={handleDateClick}
              handlePrevMonth={handlePrevToMonth}
              handleNextMonth={handleNextToMonth}
              selectedDate={selectedFromToDate.to}
              currentDate={currentFromToDate.to}
              minDate={minDate ? subDays(minDate, 1) : undefined}
              maxDate={maxDate}
            />
          </FlexRow>
        ))}
    </FlexColumn>
  );
}
