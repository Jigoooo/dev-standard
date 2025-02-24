import { extendTheme } from '@mui/joy';

import { colors } from '@/shared/constants';

export const primaryTheme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: colors.primary,
        success: colors.success,
        warning: colors.warning,
        danger: colors.error,
        background: {
          body: colors.backgroundColorLight,
        },
      },
    },
    dark: {
      palette: {
        primary: colors.primary,
        success: colors.success,
        warning: colors.warning,
        danger: colors.error,
        background: {
          body: colors.backgroundColorLight,
        },
      },
    },
  },
  fontFamily: {
    body: 'Pretendard',
    display: 'Pretendard',
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          fontSize: '15px',
        },
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: {
          fontSize: '15px',
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    JoyFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    JoySkeleton: {
      defaultProps: {
        // animation: 'wave',
      },
    },
  },
});
