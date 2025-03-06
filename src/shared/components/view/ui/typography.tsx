import { useWindowStyle } from '@/shared/hooks';
import { HTMLAttributes, ReactNode, RefObject } from 'react';

export function Typography({
  ref,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  ref?: RefObject<HTMLSpanElement | null>;
  children: ReactNode;
}) {
  const windowStyle = useWindowStyle();

  return (
    <span
      ref={ref}
      style={{
        ...windowStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
