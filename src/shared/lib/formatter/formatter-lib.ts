import { format, parse, setHours, setMinutes } from 'date-fns';

export function formatPhoneNumber(phoneNumber: string | number) {
  if (!phoneNumber) return '';

  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  let match;

  if (cleaned.length === 11) {
    match = RegExp(/^(\d{3})(\d{4})(\d{4})$/).exec(cleaned);
  } else if (cleaned.length === 10) {
    match = RegExp(/^(\d{3})(\d{3})(\d{4})$/).exec(cleaned);
  }

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return phoneNumber;
}

export function thousandSeparator(number: string | number) {
  if (!number) return '';

  const removeComma = number.toString().replaceAll(',', '');

  if (isNaN(Number(removeComma))) {
    return '';
  }

  return Number(removeComma).toLocaleString('ko-KR');
}

export function formatDateString(date: string | number, formatter: string = '.') {
  if (!date || !formatter) {
    return '';
  }

  const cleaned = ('' + date).replace(/\D/g, '');

  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{4})(\d{2})(\d{2})/, `$1${formatter}$2${formatter}$3`);
  } else if (cleaned.length === 6) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})/, `$1${formatter}$2${formatter}$3`);
  } else {
    return '' + date;
  }
}

export function formatBusinessNumberWithRegex(input: string | number) {
  const cleanInput = ('' + input).replace(/\D/g, '').substring(0, 10);

  return cleanInput.replace(/^(\d{0,3})(\d{0,2})(\d{0,5})/, function (_match, p1, p2, p3) {
    return `${p1}${p2 ? '-' + p2 : ''}${p3 ? '-' + p3 : ''}`;
  });
}

export function formatKrDate(date: string | number) {
  const match = ('' + date).match(/^(\d{4})(\d{2})(\d{2})$/);

  if (!match) {
    return '';
  }

  const year = match[1];
  const month = match[2];
  const day = match[3];

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 문자열로 받은 날짜에 대해 지정된 시간으로 변경하는 함수.
 *
 * @param date
 * @param targetHour 목표 시간 (0 ~ 23 사이의 값).
 * @param targetMinute 목표 분 (0 ~ 59 사이의 값).
 * @returns 변경된 날짜와 시간의 문자열 ('yyyyMMddHHmm' 형식).
 */
export function convertToSpecificTime(
  date: string | number,
  targetHour: number,
  targetMinute: number,
): string {
  const dateString = parse('' + date, 'yyyyMMddHHmm', new Date());

  const dateWithHourSet = setHours(dateString, targetHour);
  const finalDate = setMinutes(dateWithHourSet, targetMinute);

  return format(finalDate, 'yyyyMMddHHmm');
}

export function applyMiddleEllipsis(
  text: string,
  maxLength: number,
  frontLength: number,
  backLength: number,
) {
  if (text.length <= maxLength) {
    return text;
  }

  const startPart = text.substring(0, frontLength);
  const endPart = text.substring(text.length - backLength, text.length);

  return `${startPart}...${endPart}`;
}

export function formatAgriculturalBusinessCheckNumber(input: string) {
  const cleanInput = input.replace(/\D/g, '').substring(0, 13);

  return cleanInput.replace(/^(\d{1,6})(\d{1,7})$/, function (_match, p1, p2) {
    return `${p1}-${p2}`;
  });
}

export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function toCamelCaseObject(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCaseObject(item));
  } else if (input && typeof input === 'object' && input.constructor === Object) {
    return Object.keys(input).reduce(
      (acc, key) => {
        const camelCaseKey = toCamelCase(key);
        acc[camelCaseKey] = toCamelCaseObject(input[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return input;
}
