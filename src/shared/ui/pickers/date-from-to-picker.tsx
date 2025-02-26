import { useState, useEffect } from 'react';
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  isAfter,
  getDay,
  subDays,
  addDays,
  isEqual,
} from 'date-fns';
import { ko } from 'date-fns/locale';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Button, FlexDiv, Input } from '@/shared/ui';
import { colors } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';

type FromToDateString = {
  from: string;
  to: string;
};

type FromToDates = Record<keyof FromToDateString, Date | null>;
type FromToCurrentDates = Record<keyof FromToDateString, Date>;

type TDatePicker = {
  width?: number | string;
  fromToDateString?: FromToDateString;
  onChange?: (fromToDateString: FromToDateString) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
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
    from: fromToDateString ? new Date(fromToDateString.from) : null,
    to: fromToDateString ? new Date(fromToDateString.to) : null,
  });

  const [showFromToDatePicker, setShowFromToDatePicker] = useState(false);
  const [currentFromToDate, setCurrentFromToDate] = useState<FromToCurrentDates>({
    from: fromToDateString ? new Date(fromToDateString.from) : new Date(),
    to: fromToDateString ? new Date(fromToDateString.to) : addMonths(new Date(), 1),
  });

  useEffect(() => {
    if (fromToDateString) {
      setSelectedFromToDate({
        from: new Date(fromToDateString.from),
        to: new Date(fromToDateString.to),
      });
    }
  }, [fromToDateString]);

  const handleDateClick = (date: Date) => {
    if (!selectedFromToDate.from || (selectedFromToDate.from && selectedFromToDate.to)) {
      setSelectedFromToDate({ from: date, to: null });
      onChange?.({
        from: selectedFromToDate.from ? format(selectedFromToDate.from, dateFormat) : '',
        to: '',
      });
    } else {
      if (isBefore(date, selectedFromToDate.from)) {
        setSelectedFromToDate({ from: date, to: null });
        onChange?.({
          from: selectedFromToDate.from ? format(selectedFromToDate.from, dateFormat) : '',
          to: fromToDateString?.to ?? '',
        });
      } else {
        setShowFromToDatePicker(false);

        setSelectedFromToDate((prevState) => ({ ...prevState, to: date }));
        onChange?.({
          from: fromToDateString?.from ?? '',
          to: selectedFromToDate?.to ? format(selectedFromToDate.to, dateFormat) : '',
        });
      }
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
    currentFromToDate,
    handleDateClick,
    handlePrevFromMonth,
    handlePrevToMonth,
    handleNextFromMonth,
    handleNextToMonth,
  };
}

type FromToPickerProps = {
  selectedFromToDate: FromToDates;
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
  if (selectedFromToDate?.from && selectedFromToDate?.to) {
    if (isEqual(day, selectedFromToDate.from) || isEqual(day, selectedFromToDate.to)) {
      return 6;
    }
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
  if (selectedFromToDate?.from && selectedFromToDate?.to) {
    if (isAfter(day, selectedFromToDate.from) && isBefore(day, selectedFromToDate.to)) {
      return 'rgba(67, 122, 220, 0.1)';
    }
    if (isEqual(day, selectedFromToDate.from) || isEqual(day, selectedFromToDate.to)) {
      return colors.primary[500];
    }
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
  if (selectedFromToDate?.from && selectedFromToDate?.to) {
    if (isEqual(day, selectedFromToDate.from) || isEqual(day, selectedFromToDate.to)) {
      return 'white';
    }
  }
  return isCurrentMonth ? '#333333' : 'lightgrey';
}

// Picker 컴포넌트: 달력 렌더링
function FromToPicker({
  selectedFromToDate,
  handleDateClick,
  handlePrevMonth,
  handleNextMonth,
  selectedDate,
  currentDate,
  minDate,
  maxDate,
}: FromToPickerProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateDaysArray(year, month);
  const isSameMonth = (date: Date) => date.getMonth() === month;

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
      style={{
        marginTop: 8,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        width: 300,
      }}
    >
      <FlexDiv style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button style={{ height: 38, backgroundColor: '#ffffff' }} onClick={handlePrevMonth}>
          <ArrowBackIcon />
        </Button>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 2 }}>
          {format(currentDate, 'yyyy년 MMMM', { locale: ko })}
        </span>
        <Button style={{ height: 38, backgroundColor: '#ffffff' }} onClick={handleNextMonth}>
          <ArrowForwardIcon />
        </Button>
      </FlexDiv>
      <FlexDiv style={{ width: '100%', justifyContent: 'space-around', marginBottom: 8 }}>
        {weekDays.map((day) => (
          <div key={day}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>{day}</span>
          </div>
        ))}
      </FlexDiv>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 14 }}>
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
                  textAlign: 'center',
                  cursor: day && !isDisabled ? 'pointer' : undefined,
                  paddingBlock: 6,
                  borderRadius,
                  backgroundColor,
                  color: textColor,
                  position: 'relative',
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
  width = 'auto',
  fromToDateString,
  onChange,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
}: TDatePicker) {
  const {
    selectedFromToDate,
    showFromToDatePicker,
    setShowFromToDatePicker,
    currentFromToDate,
    handleDateClick,
    handlePrevFromMonth,
    handlePrevToMonth,
    handleNextFromMonth,
    handleNextToMonth,
  } = useDateFromToPicker({ fromToDateString, onChange, dateFormat });
  const datePickerRef = useHandleClickOutsideRef({
    condition: showFromToDatePicker,
    outsideClickAction: () => setShowFromToDatePicker(false),
  });
  const handleInputClick = () => setShowFromToDatePicker((prev) => !prev);
  const inputSelectedFromDateString = selectedFromToDate.from
    ? format(selectedFromToDate.from, dateFormat)
    : '';
  const inputSelectedToDateString = selectedFromToDate.to
    ? format(selectedFromToDate.to, dateFormat)
    : '';

  return (
    <FlexDiv ref={datePickerRef} flexDirection='column' style={{ position: 'relative', width }}>
      <FlexDiv style={{ gap: 6 }}>
        <Input
          value={inputSelectedFromDateString}
          onClick={handleInputClick}
          readOnly
          endDecorator={<CalendarMonthIcon style={{ fontSize: '1.2rem' }} />}
        />
        <Input
          value={inputSelectedToDateString}
          onClick={handleInputClick}
          readOnly
          endDecorator={<CalendarMonthIcon style={{ fontSize: '1.2rem' }} />}
        />
      </FlexDiv>
      {showFromToDatePicker && (
        <FlexDiv
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1,
            gap: 8,
          }}
        >
          <FromToPicker
            selectedFromToDate={selectedFromToDate}
            handleDateClick={handleDateClick}
            handlePrevMonth={handlePrevFromMonth}
            handleNextMonth={handleNextFromMonth}
            selectedDate={selectedFromToDate.from}
            currentDate={currentFromToDate.from}
            minDate={minDate ? subDays(minDate, 1) : undefined}
            maxDate={maxDate}
          />
          <FromToPicker
            selectedFromToDate={selectedFromToDate}
            handleDateClick={handleDateClick}
            handlePrevMonth={handlePrevToMonth}
            handleNextMonth={handleNextToMonth}
            selectedDate={selectedFromToDate.to}
            currentDate={currentFromToDate.to}
            minDate={minDate ? subDays(minDate, 1) : undefined}
            maxDate={maxDate}
          />
        </FlexDiv>
      )}
    </FlexDiv>
  );
}
