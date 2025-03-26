import { apiRequest, customedAxios } from '../config';
import { PSignIn, RSignIn, RToken } from './auth-type.ts';

export async function tokenRefreshApi(refreshToken: string) {
  return await apiRequest<RToken>(
    customedAxios.post('/v1/auth/refresh', {
      refreshToken,
    }),
  );
}

export async function signInApi(params: PSignIn) {
  return await apiRequest<RSignIn>(customedAxios.post('/v1/auth/login', {}, { params }));
}
