import type { ComponentType } from 'react';

import { RouterMenuContextWrapper } from '@/entities/router';
import {
  AlertProvider,
  ErrorProvider,
  LoadingProvider,
  QueryProvider,
  ThemeProvider,
} from '@/app/providers';
import { defaultRoutes, defaultMenus, excludeCacheMenuRouters } from './default-router-config.tsx';

export function withRouterMenuHoc<P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  return function WithRouterMenuProvider(props: P) {
    return (
      <ThemeProvider>
        <LoadingProvider />
        <AlertProvider />
        <QueryProvider>
          <ErrorProvider>
            <RouterMenuContextWrapper
              defaultRoutes={defaultRoutes}
              defaultMenus={defaultMenus}
              excludeCacheMenuRouters={excludeCacheMenuRouters}
            >
              <WrappedComponent {...props} />
            </RouterMenuContextWrapper>
          </ErrorProvider>
        </QueryProvider>
      </ThemeProvider>
    );
  };
}
