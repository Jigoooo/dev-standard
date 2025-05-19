import { apiRequest, customedAxios } from '../config';
import type {
  CheckIdParameter,
  JoinData,
  SignInParameter,
  SignInResponse,
  TokenResponse,
} from './auth-type.ts';

const PUBLIC_AUTH_ENDPOINT = '/v1/auth/public';
const AUTH_ENDPOINT = '/v1/auth';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get(`${AUTH_ENDPOINT}/token`));
}

export async function logoutApi() {
  return await apiRequest<null>(customedAxios.post(`${AUTH_ENDPOINT}/logout`));
}

export async function tokenRefreshApi(refreshToken: string) {
  return await apiRequest<TokenResponse>(
    customedAxios.post(`${PUBLIC_AUTH_ENDPOINT}/refresh`, {
      refreshToken,
    }),
  );
}

export async function signInApi(data: SignInParameter) {
  return await apiRequest<SignInResponse>(
    customedAxios.post(`${PUBLIC_AUTH_ENDPOINT}/login`, data),
  );
}

export async function joinApi(data: JoinData) {
  return await apiRequest<null>(customedAxios.post(`${PUBLIC_AUTH_ENDPOINT}/members`, data));
}

export async function checkIdApi(params: CheckIdParameter) {
  return await apiRequest<null>(
    customedAxios.get(`${PUBLIC_AUTH_ENDPOINT}/check-id`, {
      params,
    }),
  );
}
