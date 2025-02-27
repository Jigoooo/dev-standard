import { CSSProperties, useState } from 'react';

export function Link({ style, children }: { style?: CSSProperties; children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...{
          borderBottom: isHovered ? '1px solid currentColor' : '1px solid transparent',
          lineHeight: 1,
          cursor: 'pointer',
        },
        ...style,
      }}
    >
      {children}
    </span>
  );
}
