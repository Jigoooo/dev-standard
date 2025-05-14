import secureLocalStorage from 'react-secure-storage';

import type { TokenResponse } from '@/shared/api';

const TOKEN_KEY = 'token';

function isToken(token: any): token is TokenResponse {
  return (
    token !== null &&
    typeof token === 'object' &&
    typeof token.accessToken === 'string' &&
    typeof token.refreshToken === 'string'
  );
}

export function setToken(token: TokenResponse) {
  secureLocalStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}
export function getToken() {
  const tokenString = secureLocalStorage.getItem(TOKEN_KEY);

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
}

export function removeToken() {
  secureLocalStorage.removeItem(TOKEN_KEY);
}
