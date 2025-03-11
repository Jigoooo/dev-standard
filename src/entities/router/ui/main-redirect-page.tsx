import { Navigate } from 'react-router-dom';

import { Router } from '@/entities/router';

export function ErrorRedirect() {
  // const error: any = useRouteError();

  return <Navigate to={Router.MAIN} replace />;
}
