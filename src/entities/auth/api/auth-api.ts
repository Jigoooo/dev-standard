import { apiRequest, customedAxios } from '@/shared/api';
import { PSignIn, RSignIn } from '@/entities/auth/model';

export async function signInApi(params: PSignIn) {
  return apiRequest<RSignIn>(customedAxios.post('/auth/login', {}, { params }));
}
