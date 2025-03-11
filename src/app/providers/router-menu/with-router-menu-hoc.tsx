import { ComponentType } from 'react';
import { RouterMenuContextWrapper } from '@/entities/router';

export function withRouterMenuHoc<P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  return function WithRouterMenuProvider(props: P) {
    return (
      <RouterMenuContextWrapper>
        <WrappedComponent {...props} />
      </RouterMenuContextWrapper>
    );
  };
}
