import { apiRequest, customedAxios } from '@/shared/api';
import { PSignIn, RSignIn, RToken } from '@/entities/auth/model';

export async function tokenCheckApi() {
  return apiRequest<null>(customedAxios.get('/member/tokenCheck'));
}

export async function tokenRefreshApi(refreshToken: string) {
  return apiRequest<RToken>(
    customedAxios.post('/auth/refresh', {
      refreshToken,
    }),
  );
}

export async function signInApi(params: PSignIn) {
  return apiRequest<RSignIn>(customedAxios.post('/auth/login', {}, { params }));
}
