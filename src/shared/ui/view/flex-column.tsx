import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { ForwardRefComponent, MotionProps } from 'framer-motion';

type FlexColumnProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> & MotionProps & { as: E; children: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; children: ReactNode };

export function FlexColumn<E extends ElementType = 'div'>({
  as,
  style,
  children,
  ...props
}: FlexColumnProps<E>) {
  const Component = as || 'div';

  return (
    <Component style={{ display: 'flex', flexDirection: 'column', ...style }} {...props}>
      {children}
    </Component>
  );
}
