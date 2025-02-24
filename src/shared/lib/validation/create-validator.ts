import {
  isAllDigits,
  isImageSrcEmpty,
  isValidBusinessNumber,
  isValidEmail,
  isValidHomeNumber,
  isValidId,
  isValidPassword,
  isValidPhoneNumber,
} from '@/shared/lib';

export function createValidator(value: any) {
  let error = false;
  let errorMessage = '';

  const validator = {
    string({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string') {
        error = true;
        errorMessage = message ?? '문자열이어야 합니다.';
      }
      return validator;
    },
    number({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (isNaN(Number(value))) {
        error = true;
        errorMessage = message ?? '숫자여야 합니다.';
      }
      return validator;
    },
    min(minValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (value < minValue) {
        error = true;
        errorMessage = message ?? '최소값을 벗어날 수 없습니다.';
      }
      return validator;
    },
    max(maxValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (value > maxValue) {
        error = true;
        errorMessage = message ?? '최대값을 초과할 수 없습니다.';
      }
      return validator;
    },
    required({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (value === null || value === undefined || value === '') {
        error = true;
        errorMessage = message ?? '필수값을 입력해 주세요.';
      }
      return validator;
    },
    id({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidId(value)) {
        error = true;
        errorMessage = message ?? '유효한 ID가 아닙니다.';
      }
      return validator;
    },
    password({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidPassword(value)) {
        error = true;
        errorMessage = message ?? '유효한 비밀번호가 아닙니다.';
      }
      return validator;
    },
    phoneNumber({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidPhoneNumber(value)) {
        error = true;
        errorMessage = message ?? '유효한 전화번호가 아닙니다.';
      }
      return validator;
    },
    homeNumber({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidHomeNumber(value)) {
        error = true;
        errorMessage = message ?? '유효한 집 전화번호가 아닙니다.';
      }
      return validator;
    },
    allDigits({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isAllDigits(value)) {
        error = true;
        errorMessage = message ?? '모든 문자가 숫자여야 합니다.';
      }
      return validator;
    },
    email({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidEmail(value)) {
        error = true;
        errorMessage = message ?? '유효한 이메일 주소가 아닙니다.';
      }
      return validator;
    },
    businessNumber({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isValidBusinessNumber(value)) {
        error = true;
        errorMessage = message ?? '유효한 사업자 등록번호가 아닙니다.';
      }
      return validator;
    },
    imageSrcEmpty({ message }: { message?: string } = {}) {
      if (error) return validator;
      if (!isImageSrcEmpty(value)) {
        error = true;
        errorMessage = message ?? '이미지 소스가 비어 있습니다.';
      }
      return validator;
    },
    startsWith(prefix: string, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || !value.startsWith(prefix)) {
        error = true;
        errorMessage = message ?? `문자열이 '${prefix}'로 시작하지 않습니다.`;
      }
      return validator;
    },
    endsWith(suffix: string, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || !value.endsWith(suffix)) {
        error = true;
        errorMessage = message ?? `문자열이 '${suffix}'로 끝나지 않습니다.`;
      }
      return validator;
    },
    minLength(lengthValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || value.length < lengthValue) {
        error = true;
        errorMessage = message ?? `문자열의 길이는 ${lengthValue}이상이어야 합니다.`;
      }
      return validator;
    },
    maxLength(lengthValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || value.length > lengthValue) {
        error = true;
        errorMessage = message ?? `문자열의 길이는 ${lengthValue}이하여야 합니다.`;
      }
      return validator;
    },
    greaterThanOrEqual(minValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (isNaN(Number(value)) || Number(value) < minValue) {
        error = true;
        errorMessage = message ?? `값은 ${minValue} 이상이어야 합니다.`;
      }
      return validator;
    },
    lessThanOrEqual(maxValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (isNaN(Number(value)) || Number(value) > maxValue) {
        error = true;
        errorMessage = message ?? `값은 ${maxValue} 이하여야 합니다.`;
      }
      return validator;
    },
    length(lengthValue: number, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || value.length !== lengthValue) {
        error = true;
        errorMessage = message ?? `문자열의 길이는 ${lengthValue}이어야 합니다.`;
      }
      return validator;
    },
    includes(substring: string, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (typeof value !== 'string' || !value.includes(substring)) {
        error = true;
        errorMessage = message ?? `문자열에 '${substring}'이 포함되어 있지 않습니다.`;
      }
      return validator;
    },
    custom(validateFn: (value: any) => boolean, { message }: { message?: string } = {}) {
      if (error) return validator;
      if (!validateFn(value)) {
        error = true;
        errorMessage = message ?? '사용자 정의 검증에 실패했습니다.';
      }
      return validator;
    },
    validate() {
      return {
        error,
        errorMessage,
        value,
      };
    },
  };

  return validator;
}
