import { apiRequest, customedAxios } from '../config';
import type { SignInParameter, SignInResponse, TokenResponse } from './auth-type.ts';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get('/v1/auth/token'));
}

export async function tokenRefreshApi(refreshToken: string) {
  return await apiRequest<TokenResponse>(
    customedAxios.post('/v1/auth/refresh', {
      refreshToken,
    }),
  );
}

export async function signInApi(data: SignInParameter) {
  return await apiRequest<SignInResponse>(customedAxios.post('/v1/auth/login', data));
}
