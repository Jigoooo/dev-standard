import secureLocalStorage from 'react-secure-storage';
import { secureStorageKey } from '@/shared/constants';
import { RToken } from '@/entities/auth';

// RToken 타입 가드 함수
function isToken(token: any): token is RToken {
  return (
    token !== null &&
    typeof token === 'object' &&
    typeof token.accessToken === 'string' &&
    typeof token.refreshToken === 'string'
  );
}

export const setToken = (token: RToken) => {
  secureLocalStorage.setItem(secureStorageKey.TOKEN, JSON.stringify(token));
};
export const getToken = () => {
  const tokenString = secureLocalStorage.getItem(secureStorageKey.TOKEN);
  if (typeof tokenString === 'string') {
    try {
      const parsed = JSON.parse(tokenString);
      if (isToken(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse token', error);
      return null;
    }
  }
  return null;
};

export const removeToken = () => {
  secureLocalStorage.removeItem(secureStorageKey.TOKEN);
};
