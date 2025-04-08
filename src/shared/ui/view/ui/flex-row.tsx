import type { ElementType } from 'react';

import type { FlexRowProps } from '../model/view-type.ts';

export function FlexRow<E extends ElementType = 'div'>({
  as,
  ref,
  style,
  children,
  ...props
}: FlexRowProps<E>) {
  const Component = as || 'div';

  return (
    <Component ref={ref} style={{ display: 'flex', flexDirection: 'row', ...style }} {...props}>
      {children}
    </Component>
  );
}
