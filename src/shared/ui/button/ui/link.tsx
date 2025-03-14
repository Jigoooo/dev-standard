import { CSSProperties, HTMLAttributes, useState } from 'react';

import { Typography } from 'shared/ui';

export function Link({
  style,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { style?: CSSProperties; children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Typography
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...{
          userSelect: 'none',
          borderBottom: isHovered ? '1px solid currentColor' : '1px solid transparent',
          lineHeight: 1,
          cursor: 'pointer',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
