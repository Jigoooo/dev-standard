import Button from '@mui/joy/Button';
import { buttonClasses, ButtonProps } from '@mui/joy';

import { lighten } from 'polished';

interface FuturButtonProps extends ButtonProps {
  noAnimation?: boolean;
  buttonColor?: string;
}

export function PlainButton({
  children = '',
  sx = [],
  noAnimation = false,
  type = 'button',
  fullWidth = false,
  onClick,
  buttonColor,
  color,
  loading,
  disabled = false,
  startDecorator,
  endDecorator,
}: Readonly<FuturButtonProps>) {
  return (
    <Button
      className={'selection-none'}
      disabled={disabled}
      tabIndex={-1}
      sx={[
        noAnimation
          ? {}
          : {
              transition: '0.4s',
            },
        {
          width: 'auto',
          height: 40,
          paddingTop: 1.0,
        },
        buttonColor && {
          color: buttonColor,
          [`&.${buttonClasses.root}`]: {
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': {
                backgroundColor: `${lighten(0.4, buttonColor)} !important`,
              },
            },
            '&:focus': {
              backgroundColor: 'none !important',
            },
            '&:active': {
              backgroundColor: `${lighten(0.3, buttonColor)} !important`,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={color}
      variant={'plain'}
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
      loading={loading}
      startDecorator={startDecorator}
      endDecorator={endDecorator}
    >
      {children}
    </Button>
  );
}
