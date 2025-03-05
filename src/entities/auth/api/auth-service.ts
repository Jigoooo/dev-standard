import { useMutation } from '@tanstack/react-query';
import { signInApi } from './auth-api.ts';
import { PSignIn } from '@/entities/auth/model';

export function useSignInService() {
  return useMutation({
    mutationFn: (params: PSignIn) => signInApi(params),
  });
}
