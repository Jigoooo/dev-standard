import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { MotionProps, ForwardRefComponent } from 'framer-motion';

type FlexRowProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> & MotionProps & { as: E; children: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; children: ReactNode };

export function FlexRow<E extends ElementType = 'div'>({
  as,
  style,
  children,
  ...props
}: FlexRowProps<E>) {
  const Component = as || 'div';

  return (
    <Component style={{ display: 'flex', flexDirection: 'row', ...style }} {...props}>
      {children}
    </Component>
  );
}
