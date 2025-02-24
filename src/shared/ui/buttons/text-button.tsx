import Button from '@mui/joy/Button';
import { buttonClasses, ButtonProps } from '@mui/joy';
import { darken } from 'polished';
import { colors } from '@/shared/constants';

interface FuturButtonProps extends ButtonProps {
  noAnimation?: boolean;
  buttonColor?: string;
}

export function TextButton({
  children = '',
  sx = [],
  type = 'button',
  title = '',
  fullWidth = false,
  size,
  onClick,
  color,
  buttonColor = colors.primary[400],
  noAnimation,
  disabled,
}: Readonly<FuturButtonProps>) {
  return (
    <Button
      className={'selection-none'}
      tabIndex={-1}
      disabled={disabled}
      sx={[
        noAnimation
          ? {}
          : {
              transition: '0.4s',
            },
        {
          width: 'auto',
          paddingTop: 1.0,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: buttonColor,
          fontWeight: 600,
        },
        buttonColor && {
          borderColor: buttonColor,
          color: buttonColor,
          [`&.${buttonClasses.root}`]: {
            '&:hover': {
              backgroundColor: `transparent !important`,
              color: `${darken(0.1, buttonColor)} !important`,
            },
            '&:focus': {
              backgroundColor: 'transparent !important',
            },
            '&:active': {
              backgroundColor: `transparent !important`,
              color: `${darken(0.2, buttonColor)} !important`,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant='plain'
      color={color}
      type={type}
      title={title}
      fullWidth={fullWidth}
      size={size}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
