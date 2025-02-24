import { Box } from '@mui/joy';

export function DashedDivider() {
  return (
    <Box component='svg' sx={{ width: '100%', height: '1px' }}>
      <line
        x1='0'
        y1='0'
        x2='100%'
        y2='0'
        stroke='#888888'
        strokeWidth='1'
        strokeDasharray='4, 4'
      />
    </Box>
  );
}
