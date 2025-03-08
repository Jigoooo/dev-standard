import { endOfYear, format, subYears } from 'date-fns';

import { dialogActions, DialogType } from '@/shared/components';

export const currentYear = new Date().getFullYear();

export function deepCopy<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let copy;

  if (Array.isArray(obj)) {
    copy = [];

    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i]);
    }
  } else {
    copy = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // @ts-expect-error
        copy[key] = deepCopy(obj[key]);
      }
    }
  }

  return copy as T;
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function timeoutAction(timeoutCallback: any, time: number = 800) {
  setTimeout(() => {
    timeoutCallback?.();
  }, time);
}

export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function convertToRGBA(hexColor: string, alpha: number) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getYears(prevYearCount: number = 100) {
  const years = [];

  for (let i = currentYear; i >= currentYear - prevYearCount; i--) {
    const formattedYear = format(endOfYear(subYears(new Date(), currentYear - i)), 'yyyy');
    years.push(formattedYear);
  }

  return years;
}

export function logOnDev(message: string) {
  if (import.meta.env.DEV) {
    console.log(message);
  }
}

export function setScreenSize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function transformArrayToDictByKey<T, K extends keyof T>(
  array: T[],
  key: K,
): { [key: string]: T } {
  return array.reduce((acc: { [key: string]: T }, cur: T) => {
    const keyValue = String(cur[key]);

    acc[keyValue] = cur;

    return acc;
  }, {});
}

export function generateRandomNumber(a: number) {
  return Math.floor(Math.random() * a);
}

export function detectDeviceTypeAndOS() {
  const ua = navigator.userAgent;

  const isAndroid = () => /Android/i.test(ua);
  const isIOS = () => /iPhone|iPad|iPod/i.test(ua);

  const isTablet = /iPad|Tablet|PlayBook/i.test(ua) || (isAndroid() && !/(Mobile)/i.test(ua));
  const isMobile =
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
      ua,
    ) && !isTablet;
  const isDesktop = !isTablet && !isMobile;

  return { isDesktop, isAndroid: isAndroid(), isIOS: isIOS(), isMobile, isTablet };
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const scrollToTopNoneSmooth = () => {
  window.scrollTo({
    top: 0,
  });
};

export function openPhoneApp(phoneNumber: string) {
  window.location.href = `tel:${phoneNumber}`;
}

export function openSmsApp(phoneNumber: string, message: string = '') {
  window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
}

export function openKakaoMap({
  latitude,
  longitude,
  webUrl,
}: {
  latitude: number;
  longitude: number;
  webUrl: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    // window.location.href = `kakaomap://look?p=${latitude},${longitude}`;
    window.location.href = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;
  } else {
    window.open(webUrl);
  }
}

export function openTMap({
  latitude,
  longitude,
  placeName,
}: {
  latitude: number;
  longitude: number;
  placeName: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    window.location.href = `tmap://search?name=${encodeURIComponent(placeName)}&lon=${longitude}&lat=${latitude}`;
  } else {
    dialogActions.openDialog({
      contents: '모바일에서만 지원됩니다.',
      dialogType: DialogType.WARNING,
    });
  }
}

export function openNaverMap({
  latitude,
  longitude,
  placeName,
  webUrl,
}: {
  latitude: number;
  longitude: number;
  placeName: string;
  webUrl: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    // window.location.href = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(placeName)}&appname=com.example.myapp`;
    window.location.href = `nmap://navigation?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(placeName)}&appname=com.example.myapp`;
  } else {
    window.open(webUrl);
  }
}

export function copyToClipboard(text: string, successCallback?: () => void) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(successCallback)
      .catch((err) => console.log('err: ', err));
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successCallback) {
      successCallback();
    }
  }
}

export function isLightColor(color: string): boolean {
  // HEX 색상을 RGB로 변환
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // 상대 밝기 계산
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // 밝기 기준(0.5)으로 판단
  return luminance > 0.5;
}

export function getFormValues<T extends Record<string, string | null>>(
  formData: FormData,
  fields: Record<keyof T, string>,
): T {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = formData.get(fields[key as keyof T]) as T[keyof T];
    return acc;
  }, {} as Partial<T>) as T;
}

export function deepEqual(a: any, b: any, seen = new Map<any, any>()): boolean {
  // 동일한 객체이거나 원시값인 경우
  if (a === b) return true;

  // 함수 비교: 두 함수라면 toString()으로 비교 (참조값 비교보다 더 깊은 비교)
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }

  // 둘 중 하나라도 null 이거나 객체가 아닌 경우
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 순환 참조 처리를 위해, a를 이미 봤다면 b와 비교해서 같으면 true
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  // 현재 a와 b를 비교 대상으로 기록
  seen.set(a, b);

  // 배열 비교
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  // 하나는 배열인데 다른 하나는 배열이 아닌 경우
  if (Array.isArray(b)) return false;

  // 일반 객체 비교: 키 개수와 각 키의 값 비교
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }
  return true;
}
