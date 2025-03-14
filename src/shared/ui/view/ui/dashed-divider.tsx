import { CSSProperties, SVGProps } from 'react';

export function DashedDivider({
  style,
  strokeColor = '#888888',
  ...props
}: SVGProps<SVGSVGElement> & { style?: CSSProperties; strokeColor?: string }) {
  return (
    <svg
      style={{
        ...{ width: '100%', height: 1 },
        ...style,
      }}
      {...props}
    >
      <line
        x1='0'
        y1='0'
        x2='100%'
        y2='0'
        stroke={strokeColor}
        strokeWidth='2'
        strokeDasharray='4, 4'
      />
    </svg>
  );
}
