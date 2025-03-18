import { ComponentType } from 'react';
import { RouterMenuContextWrapper } from '@/entities/router';
import { AlertProvider, LoadingProvider, ThemeProvider } from '@/app/providers';

export function withRouterMenuHoc<P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  return function WithRouterMenuProvider(props: P) {
    return (
      <ThemeProvider>
        <LoadingProvider />
        <AlertProvider />
        <RouterMenuContextWrapper>
          <WrappedComponent {...props} />
        </RouterMenuContextWrapper>
      </ThemeProvider>
    );
  };
}
