import type { CSSProperties } from 'react';

export function Divider({
  direction = 'horizontal',
  style,
}: {
  direction?: 'horizontal' | 'vertical';
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        ...(direction === 'vertical'
          ? { width: 1, height: '100%', backgroundColor: '#cccccc' }
          : { height: 1, width: '100%', backgroundColor: '#cccccc' }),
        ...style,
      }}
    />
  );
}
