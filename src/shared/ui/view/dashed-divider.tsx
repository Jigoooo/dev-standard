export function DashedDivider() {
  return (
    <svg style={{ width: '100%', height: 1 }}>
      <line
        x1='0'
        y1='0'
        x2='100%'
        y2='0'
        stroke='#888888'
        strokeWidth='1'
        strokeDasharray='4, 4'
      />
    </svg>
  );
}
