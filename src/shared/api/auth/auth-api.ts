import { apiRequest, customedAxios } from '../config';
import type { SignInParameter, SignInResponse, TokenResponse } from './auth-type.ts';

const AUTH_ENDPOINT = '/v1/auth';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get(`${AUTH_ENDPOINT}/token`));
}

export async function tokenRefreshApi(refreshToken: string) {
  console.log(refreshToken);
  return await apiRequest<TokenResponse>(
    customedAxios.post(`${AUTH_ENDPOINT}/refresh`, {
      refreshToken,
    }),
  );
}

export async function signInApi(data: SignInParameter) {
  return await apiRequest<SignInResponse>(customedAxios.post(`${AUTH_ENDPOINT}/login`, data));
}
