import { CSSProperties } from 'react';

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
          ? { width: 1.2, height: '100%', backgroundColor: '#aaaaaa' }
          : { height: 1.2, width: '100%', backgroundColor: '#aaaaaa' }),
        ...style,
      }}
    />
  );
}
