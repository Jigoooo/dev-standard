import type { ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useTokenSignInQuery } from '@/shared/api';
import { Router } from '@/shared/router';

export function AuthGuard({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const tokenSignInQuery = useTokenSignInQuery();
  if (!searchParams.get('isLogout') && tokenSignInQuery.data && tokenSignInQuery.data?.isSuccess) {
    return <Navigate to={Router.MAIN} replace />;
  }

  if (tokenSignInQuery.isFetching) {
    return null;
  }

  return <>{children}</>;
}
