import { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export function FlexDiv({
  flexDirection = 'row',
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  children: ReactNode;
}) {
  return (
    <div
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
