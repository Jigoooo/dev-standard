import { useMutation } from '@tanstack/react-query';

import { signInApi } from './auth-api.ts';
import type { SignInParameter } from './auth-type.ts';
import { loading } from '@/shared/ui';

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: SignInParameter) => signInApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
