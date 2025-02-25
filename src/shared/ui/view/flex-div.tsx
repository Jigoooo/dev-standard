import { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

export function FlexDiv({
  ref,
  flexDirection = 'row',
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement> | null;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  children: ReactNode;
}) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection,
        ...(style as CSSProperties),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
