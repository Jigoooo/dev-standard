import { HTMLAttributes, useState } from 'react';

import { Typography } from '@/shared/ui';

export function Link({
  style,
  children,
  disabled = false,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { disabled?: boolean; children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Typography
      onMouseEnter={() => {
        if (disabled) {
          return;
        }

        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (disabled) {
          return;
        }

        setIsHovered(false);
      }}
      style={{
        ...{
          userSelect: 'none',
          borderBottom: isHovered ? '1px solid currentColor' : '1px solid transparent',
          lineHeight: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
