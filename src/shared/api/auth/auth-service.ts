import { useMutation } from '@tanstack/react-query';

import { signInApi } from './auth-api.ts';
import { PSignIn } from './auth-type.ts';
import { loading } from '@/shared/ui';

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: PSignIn) => signInApi(params),
    onSuccess: () => {},
    onMutate: () => loading.show(),
    onSettled: () => loading.hide(),
  });
}
