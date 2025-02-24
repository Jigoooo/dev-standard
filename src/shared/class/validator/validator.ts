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

export class Validator {
  private readonly value: any;
  private error: boolean;
  private errorMessage: string;

  constructor(value: any) {
    this.value = value;
    this.error = false;
    this.errorMessage = '';
  }

  isString(message?: string) {
    if (this.error) return this;
    if (typeof this.value !== 'string') {
      this.error = true;
      this.errorMessage = message ?? '문자열이어야 합니다.';
    }
    return this;
  }

  isNumber(message?: string) {
    if (this.error) return this;
    if (typeof this.value !== 'number') {
      this.error = true;
      this.errorMessage = message ?? '숫자여야 합니다.';
    }
    return this;
  }

  min(minValue: number, message?: string) {
    if (this.error) return this;
    if (this.value < minValue) {
      this.error = true;
      this.errorMessage = message ?? '최소값을 벗어날 수 없습니다.';
    }
    return this;
  }

  max(maxValue: number, message?: string) {
    if (this.error) return this;
    if (this.value > maxValue) {
      this.error = true;
      this.errorMessage = message ?? '최대값을 초과할 수 없습니다.';
    }
    return this;
  }

  required(message?: string) {
    if (this.error) return this;
    if (this.value === null || this.value === undefined || this.value === '') {
      this.error = true;
      this.errorMessage = message ?? '필수값을 입력해 주세요.';
    }
    return this;
  }

  isValidId(message?: string) {
    if (this.error) return this;
    if (!isValidId(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 ID가 아닙니다.';
    }
    return this;
  }

  isValidPassword(message?: string) {
    if (this.error) return this;
    if (!isValidPassword(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 비밀번호가 아닙니다.';
    }
    return this;
  }

  isValidPhoneNumber(message?: string) {
    if (this.error) return this;
    if (!isValidPhoneNumber(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 전화번호가 아닙니다.';
    }
    return this;
  }

  isValidHomeNumber(message?: string) {
    if (this.error) return this;
    if (!isValidHomeNumber(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 집 전화번호가 아닙니다.';
    }
    return this;
  }

  isAllDigits(message?: string) {
    if (this.error) return this;
    if (!isAllDigits(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '모든 문자가 숫자여야 합니다.';
    }
    return this;
  }

  isValidEmail(message?: string) {
    if (this.error) return this;
    if (!isValidEmail(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 이메일 주소가 아닙니다.';
    }
    return this;
  }

  isValidBusinessNumber(message?: string) {
    if (this.error) return this;
    if (!isValidBusinessNumber(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '유효한 사업자 등록번호가 아닙니다.';
    }
    return this;
  }

  isImageSrcEmpty(message?: string) {
    if (this.error) return this;
    if (!isImageSrcEmpty(this.value)) {
      this.error = true;
      this.errorMessage = message ?? '이미지 소스가 비어 있습니다.';
    }
    return this;
  }

  validate() {
    return {
      error: this.error,
      errorMessage: this.errorMessage,
      value: this.value,
    };
  }
}
