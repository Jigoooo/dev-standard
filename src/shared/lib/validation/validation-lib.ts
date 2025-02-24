import { KeyboardEvent } from 'react';

export function formEnterPrevention(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

export function isValidId(username: string) {
  const regex = /^[0-9a-zA-Z]+$/;
  return regex.test(username);
}

export function isValidPassword(password: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*+=-]).*$/;
  return regex.test(password);
}

export function isValidPhoneNumber(phoneNumber: string) {
  const regex = /^((\d{3}-\d{4}-\d{4})|(\d{3}-\d{3}-\d{4}))$/;
  return regex.test(phoneNumber);
}

export function isValidHomeNumber(phoneNumber: string) {
  const patternMatch = phoneNumber.match(/^(?:\d+-){2}\d+$/);
  if (!patternMatch) return false;

  const digitsOnly = phoneNumber.replace(/-/g, '');
  const digitCount = digitsOnly.length;

  return digitCount >= 9 && digitCount <= 11;
}

export function isAllDigits(inputString: string) {
  const regex = /^\d+$/;
  return regex.test(inputString);
}

export function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function isValidBusinessNumber(number: string) {
  const regex = /^\d{3}-\d{2}-\d{5}$/;
  return regex.test(number);
}

export function isImageSrcEmpty(html: string) {
  const regex = /<img\s+src=["']\s*["']/i;

  return regex.test(html);
}

export function isValidAgriculturalBusinessCheckNumber(number: string) {
  const regex = /^\d{6}-\d{7}$/;
  return regex.test(number);
}
