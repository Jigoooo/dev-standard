import { useState, useEffect } from 'react';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

export function ColorModeSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <IconButton size='sm' variant='outlined' color='neutral' disabled />;
  }

  return (
    <IconButton
      id='toggle-mode'
      size='sm'
      variant={props.variant}
      color='neutral'
      aria-label='toggle light/dark mode'
      {...other}
      onClick={(event) => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
        onClick?.(event);
      }}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
    // <Box>
    //   <FuturThemeToggle />
    // </Box>
  );
}

ColorModeSchemeToggle.defaultProps = {
  variant: 'outlined',
};
