import { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { ForwardRefComponent, MotionProps } from 'framer-motion';

type FlexColumnProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> &
        MotionProps & { as: E; ref?: Ref<any> | null; children: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; ref?: Ref<any> | null; children: ReactNode };

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
