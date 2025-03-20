import { useEffect, useState } from 'react';
import { format, isAfter, isBefore } from 'date-fns';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { FlexRow, Input, Typography } from '@/shared/ui';

export function DateInputField({
  selectedDate,
  handleDateClick,
  handleInputClick,
  minDate,
  maxDate,
}: {
  selectedDate: Date | null;
  handleDateClick: (date: Date) => void;
  handleInputClick: () => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  // isInputMode 일 때: 연, 월, 일을 각각의 상태로 관리
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [dayInput, setDayInput] = useState('');

  // selectedDate가 바뀌면 각 input에 반영
  useEffect(() => {
    if (selectedDate) {
      setYearInput(format(selectedDate, 'yyyy'));
      setMonthInput(format(selectedDate, 'MM'));
      setDayInput(format(selectedDate, 'dd'));
    }
  }, [selectedDate]);

  // 모든 입력창이 blur될 때 날짜를 재구성
  const handleBlur = () => {
    const year = parseInt(yearInput, 10);
    const month = parseInt(monthInput, 10);
    const day = parseInt(dayInput, 10);

    if (month < 1 || month > 12) {
      if (selectedDate) {
        setMonthInput(format(selectedDate, 'MM'));
      }
      return;
    }

    const constructedDate = new Date(year, month - 1, day);
    if (
      constructedDate.getFullYear() !== year ||
      constructedDate.getMonth() !== month - 1 ||
      constructedDate.getDate() !== day
    ) {
      if (selectedDate) {
        setDayInput(format(selectedDate, 'dd'));
      }
      return;
    }

    if (maxDate && isAfter(constructedDate, maxDate)) {
      if (selectedDate) {
        setYearInput(format(selectedDate, 'yyyy'));
        setMonthInput(format(selectedDate, 'MM'));
        setDayInput(format(selectedDate, 'dd'));
      } else {
        setYearInput(format(new Date(), 'yyyy'));
        setMonthInput(format(new Date(), 'MM'));
        setDayInput(format(new Date(), 'dd'));
        handleDateClick(new Date());
      }
      return;
    }
    if (minDate && isBefore(constructedDate, minDate)) {
      if (selectedDate) {
        setYearInput(format(selectedDate, 'yyyy'));
        setMonthInput(format(selectedDate, 'MM'));
        setDayInput(format(selectedDate, 'dd'));
      } else {
        setYearInput(format(new Date(), 'yyyy'));
        setMonthInput(format(new Date(), 'MM'));
        setDayInput(format(new Date(), 'dd'));
        handleDateClick(new Date());
      }
      return;
    }

    handleDateClick(constructedDate);
  };

  return (
    <FlexRow
      style={{
        alignItems: 'center',
        width: 140,
        borderRadius: 4,
        height: 38,
        border: '1px solid #d9d9d9',
        paddingLeft: 4,
        paddingRight: 8,
        justifyContent: 'space-between',
      }}
    >
      <Input
        style={{
          boxShadow: 'none',
          width: 40,
          textAlign: 'center',
          padding: 0,
        }}
        value={yearInput}
        onChange={(e) => setYearInput(e.target.value)}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        maxLength={4}
        isFocusEffect={false}
      />
      <Typography>-</Typography>
      <Input
        style={{
          boxShadow: 'none',
          width: 20,
          textAlign: 'center',
          padding: 0,
        }}
        value={monthInput}
        onChange={(e) => setMonthInput(e.target.value)}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        maxLength={2}
        isFocusEffect={false}
      />
      <Typography>-</Typography>
      <Input
        style={{
          boxShadow: 'none',
          width: 20,
          textAlign: 'center',
          padding: 0,
        }}
        value={dayInput}
        onChange={(e) => setDayInput(e.target.value)}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        maxLength={2}
        isFocusEffect={false}
      />
      <div style={{ width: 10 }} />
      <CalendarMonthIcon style={{ fontSize: '1.2rem' }} onClick={handleInputClick} />
    </FlexRow>
  );
}
