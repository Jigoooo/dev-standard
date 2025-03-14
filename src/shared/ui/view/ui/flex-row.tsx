import { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { MotionProps, ForwardRefComponent } from 'framer-motion';

type FlexRowProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> &
        MotionProps & { as: E; ref?: Ref<any> | null; children?: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; ref?: Ref<any> | null; children?: ReactNode };

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
