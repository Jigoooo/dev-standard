import React from 'react';
import { SnackbarCloseReason } from '@mui/base/useSnackbar/useSnackbar.types';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import { OverridableStringUnion } from '@mui/types';
import { ColorPaletteProp } from '@mui/joy/styles/types';
import { SnackbarPropsColorOverrides } from '@mui/joy/Snackbar/SnackbarProps';
import { CircularProgress } from '@mui/joy';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

import { hideSnackBar, useSnackBarInfo, useSnackBarOpenState } from '@/shared/components/snack-bar';
import { SNACK_BAR_Z_INDEX } from '@/shared/constants';

export function SnackBar() {
  const open = useSnackBarOpenState();
  const { message, duration, color, variant } = useSnackBarInfo();

  const autoHideDuration = duration ?? 3000;

  return (
    <>
      <Snackbar
        sx={{ zIndex: SNACK_BAR_Z_INDEX, backgroundColor: '#414141', color: '#ffffff' }}
        color={color !== 'loading' ? color : 'neutral'}
        variant={variant}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={(
          _event: React.SyntheticEvent<any> | Event | null,
          reason: SnackbarCloseReason,
        ) => {
          if (color === 'loading' && reason === 'clickaway') {
            return;
          }

          hideSnackBar();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        startDecorator={getIcon(color)}
        endDecorator={
          color !== 'loading' && !autoHideDuration ? (
            <Button onClick={hideSnackBar} size='sm' variant='soft' color={color ?? 'neutral'}>
              닫기
            </Button>
          ) : (
            <></>
          )
        }
      >
        {message}
      </Snackbar>
    </>
  );
}

const getIcon = (
  color?: OverridableStringUnion<ColorPaletteProp, SnackbarPropsColorOverrides> | 'loading',
) => {
  if (color === 'loading') {
    return <CircularProgress color='primary' />;
  }

  switch (color) {
    case 'danger':
      return <ReportIcon sx={{ color: '#f14242' }} />;
    case 'warning':
      return <WarningIcon sx={{ color: '#f67a45' }} />;
    case 'success':
      return <CheckCircleIcon sx={{ color: '#4ced34' }} />;
    case 'neutral':
    default:
      return <InfoIcon />;
  }
};
