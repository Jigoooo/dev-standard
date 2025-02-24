import { useTheme } from '@mui/joy/styles';
import { Breakpoint, useMediaQuery } from '@mui/material';

export function useSizeMatch(size: Breakpoint | number) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(size));
}
