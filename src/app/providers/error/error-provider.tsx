import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ComponentErrorPage } from 'shared/ui';

export function ErrorProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => {
        return <ComponentErrorPage {...props} />;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
