import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { MotionProps } from 'framer-motion';

interface FlexDivProps<E extends ElementType = 'div'> extends HTMLAttributes<HTMLElement> {
  as?: E;
  children: ReactNode;
}

export function FlexColumn<E extends ElementType = 'div'>({
  as,
  style,
  children,
  ...props
}: FlexDivProps<E> & MotionProps) {
  const Component = as || 'div';
  return (
    <Component style={{ display: 'flex', flexDirection: 'column', ...style }} {...props}>
      {children}
    </Component>
  );
}
