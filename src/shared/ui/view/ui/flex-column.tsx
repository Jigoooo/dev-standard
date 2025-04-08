import type { ElementType } from 'react';

import type { FlexColumnProps } from '../model/view-type.ts';

export function FlexColumn<E extends ElementType = 'div'>({
  as,
  ref,
  style,
  children,
  ...props
}: FlexColumnProps<E>) {
  const Component = as || 'div';

  return (
    <Component ref={ref} style={{ display: 'flex', flexDirection: 'column', ...style }} {...props}>
      {children}
    </Component>
  );
}
