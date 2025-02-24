import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ComponentErrorPage } from '@/shared/components';

export function ErrorProvider({ children }: { children: ReactNode }) {
  // const isError = useErrorState();
  //
  // if (isError) {
  //   throw new Error();
  // }

  return <ErrorBoundary fallbackRender={ComponentErrorPage}>{children}</ErrorBoundary>;
}
