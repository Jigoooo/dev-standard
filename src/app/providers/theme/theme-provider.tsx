import { ReactNode } from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';

import { primaryTheme } from '@/app/themes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalStyles
        styles={() => ({
          ':root': {
            '--Header-height': '80px',
            '--Sidebar-width': '250px',
          },
        })}
      />
      <CssBaseline />
      <CssVarsProvider theme={primaryTheme} defaultMode='light' disableTransitionOnChange>
        {children}
      </CssVarsProvider>
    </>
  );
}
