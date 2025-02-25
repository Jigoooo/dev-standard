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
} from 'date-fns';
import { ko } from 'date-fns/locale';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Button, FlexDiv, Input } from '@/shared/ui';
import { colors } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';

type TDatePicker = {
  width?: number | string;
  dateString?: string;
  fromDateString?: string;
  toDateString?: string;
  onChange?: (dateString: string) => void;
  onChangeFrom?: (fromDateString: string) => void;
  onChangeTo?: (toDateString: string) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
};

const generateDaysArray = (year: number, month: number) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  const daysInMonth = eachDayOfInterval({ start, end });

  const startPaddingDays = Array.from({ length: getDay(start) })
    .map((_, index) => {
      return subDays(start, index + 1);
    })
    .reverse();

  const endPaddingDays = Array.from({ length: 6 - getDay(end) }).map((_, index) => {
    return addDays(end, index + 1);
  });

  return [...startPaddingDays, ...daysInMonth, ...endPaddingDays];
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const useDatePicker = ({
  dateString,
  onChange,
  dateFormat,
}: {
  dateString?: string;
  onChange?: (dateString: string) => void;
  dateFormat: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateString ? new Date(dateString) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (dateString) {
      setSelectedDate(new Date(dateString));
    }
  }, [dateString]);

  useEffect(() => {
    if (!showDatePicker) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate, showDatePicker]);

  const handleDateClick = (date: Date) => {
    setShowDatePicker(false);
    if (onChange) {
      onChange(format(date, dateFormat));
    }
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return {
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    currentDate,
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
  };
};

export function DatePicker({
  width = 'auto',
  dateString,
  fromDateString,
  toDateString,
  onChange,
  onChangeFrom,
  onChangeTo,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  isRange,
}: TDatePicker) {
  const {
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    currentDate,
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
  } = useDatePicker({ dateString, onChange, dateFormat });

  const {
    selectedDate: selectedFromDate,
    currentDate: currentFromDate,
    handleDateClick: handleFromDateClick,
    handlePrevMonth: handleFromPrevMonth,
    handleNextMonth: handleFromNextMonth,
  } = useDatePicker({ dateString: fromDateString, onChange: onChangeFrom, dateFormat });

  const {
    selectedDate: selectedToDate,
    showDatePicker: showFromToDatePicker,
    setShowDatePicker: setShowFromToDatePicker,
    currentDate: currentToDate,
    handleDateClick: handleToDateClick,
    handlePrevMonth: handleToPrevMonth,
    handleNextMonth: handleToNextMonth,
  } = useDatePicker({ dateString: toDateString, onChange: onChangeTo, dateFormat });

  const datePickerRef = useHandleClickOutsideRef({
    condition: isRange ? showFromToDatePicker : showDatePicker,
    outsideClickAction: () => (isRange ? setShowFromToDatePicker(false) : setShowDatePicker(false)),
  });

  const handleInputClick = () => {
    if (isRange) {
      setShowFromToDatePicker((prev) => !prev);
    } else {
      setShowDatePicker((prev) => !prev);
    }
  };

  const inputSelectedDateString = selectedDate ? format(selectedDate, dateFormat) : '';
  const inputFromDateString = selectedFromDate ? format(selectedFromDate, dateFormat) : '';
  const inputToDateString = selectedToDate ? format(selectedToDate, dateFormat) : '';

  return (
    <FlexDiv ref={datePickerRef} flexDirection={'column'} style={{ position: 'relative', width }}>
      <Input
        value={isRange ? `${inputFromDateString} ~ ${inputToDateString}` : inputSelectedDateString}
        onClick={handleInputClick}
        readOnly
        endDecorator={<CalendarMonthIcon style={{ fontSize: '1.2rem' }} />}
      />
      {isRange && showFromToDatePicker && (
        <FlexDiv>
          <Picker
            rangeDate={{ from: selectedFromDate, to: selectedToDate }}
            handleDateClick={handleFromDateClick}
            handlePrevMonth={handleFromPrevMonth}
            handleNextMonth={handleFromNextMonth}
            selectedDate={selectedFromDate}
            currentDate={currentFromDate}
            minDate={minDate}
            maxDate={selectedToDate}
            offsetX={-160}
          />
          <Picker
            rangeDate={{ from: selectedFromDate, to: selectedToDate }}
            handleDateClick={handleToDateClick}
            handlePrevMonth={handleToPrevMonth}
            handleNextMonth={handleToNextMonth}
            selectedDate={selectedToDate}
            currentDate={currentToDate}
            minDate={subDays(selectedFromDate, 1)}
            maxDate={maxDate}
            offsetX={150}
          />
        </FlexDiv>
      )}
      {!isRange && showDatePicker && (
        <Picker
          handleDateClick={handleDateClick}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          selectedDate={selectedDate}
          currentDate={currentDate}
          minDate={minDate}
          maxDate={maxDate}
          offsetX={0}
        />
      )}
    </FlexDiv>
  );
}

function Picker({
  rangeDate,
  handleDateClick,
  handlePrevMonth,
  handleNextMonth,
  selectedDate,
  currentDate,
  minDate,
  maxDate,
  offsetX,
}: {
  isRangeType?: 'from' | 'to' | 'none';
  rangeDate?: { from: Date; to: Date };
  handleDateClick: (date: Date) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  selectedDate: Date;
  currentDate: Date;
  minDate?: Date;
  maxDate?: Date;
  offsetX: number;
}) {
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

  const getBorderRadius = (day: Date | null) => {
    if (!day) return 0;
    if (selectedDate && selectedDate.toDateString() === day.toDateString()) return 6;
    return 0;
  };
  const getBackgroundColor = (day: Date | null) => {
    if (!day) return 'transparent';
    if (selectedDate && selectedDate.toDateString() === day.toDateString())
      return colors.primary[500];
    return '#ffffff';
  };

  const getColor = (day: Date | null, isDisabled: boolean, isCurrentMonth: boolean) => {
    if (!day) return 'transparent';
    if (isDisabled) return 'grey';
    if (selectedDate && selectedDate.toDateString() === day.toDateString()) return 'white';
    return isCurrentMonth ? 'text.primary' : 'lightgrey';
  };

  const getOverlayColor = (day: Date | null) => {
    if (!day || !rangeDate) return 'transparent';
    if (rangeDate.from && rangeDate.to && day >= rangeDate.from && day <= rangeDate.to)
      return 'rgba(67, 122, 220, 0.1)';
    return 'transparent';
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: offsetX,
        zIndex: 1,
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
        {weekDays.map((weekDay) => (
          <div key={weekDay}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>{weekDay}</span>
          </div>
        ))}
      </FlexDiv>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          rowGap: 14,
          columnGap: 0,
        }}
      >
        {days.map((day, index) => {
          const isDisabled =
            !!day &&
            ((minDate ? isBefore(day, minDate) : false) ||
              (maxDate ? isAfter(day, maxDate) : false));
          const isCurrentMonth = !!day && isSameMonth(day);
          const dayBorderRadius = getBorderRadius(day);
          const dayBackgroundColor = getBackgroundColor(day);
          const dayColor = getColor(day, isDisabled, isCurrentMonth);
          const overlayColor = getOverlayColor(day);

          return (
            <div key={index} style={{ gridColumn: 'span 1' }}>
              <div
                onClick={() => {
                  if (day && !isDisabled) {
                    if (isCurrentMonth) {
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
                  borderRadius: dayBorderRadius,
                  backgroundColor: dayBackgroundColor,
                  color: dayColor,
                  position: 'relative',
                }}
              >
                {day ? format(day, 'd') : ''}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: overlayColor,
                    borderRadius: dayBorderRadius,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
