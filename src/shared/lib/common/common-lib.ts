import { endOfYear, format, subYears } from 'date-fns';
import { openDialog } from '@/shared/components';

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
    openDialog({
      contents: '모바일에서만 지원됩니다.',
      color: 'warning',
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
