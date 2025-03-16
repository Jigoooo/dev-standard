import { apiRequest, customedAxios } from '@/shared/api';
import { PSignIn, RSignIn, RToken } from '../model';

export async function tokenCheckApi() {
  return await apiRequest<null>(customedAxios.get('/member/tokenCheck'));
}

export async function tokenRefreshApi(refreshToken: string) {
  return await apiRequest<RToken>(
    customedAxios.post('/auth/refresh', {
      refreshToken,
    }),
  );
}

export async function signInApi(params: PSignIn) {
  return await apiRequest<RSignIn>(customedAxios.post('/auth/login', {}, { params }));
}
