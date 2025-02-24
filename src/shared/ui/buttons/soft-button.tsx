import { isMobile } from 'react-device-detect';
import Button from '@mui/joy/Button';
import { buttonClasses, ButtonProps } from '@mui/joy';
import { darken, lighten } from 'polished';

interface FuturButtonProps extends ButtonProps {
  noAnimation?: boolean;
  buttonColor?: string;
}

export function SoftButton({
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
  const hasButtonColorStyle = isMobile
    ? {
        backgroundColor: buttonColor,
        color: buttonColor,
        [`&.${buttonClasses.root}`]: {
          '&:hover': {
            backgroundColor: buttonColor!,
          },
          '&:focus': {
            backgroundColor: buttonColor!,
          },
          '&:active': {
            backgroundColor: buttonColor!,
            color: darken(0.1, buttonColor!),
          },
        },
      }
    : {
        backgroundColor: lighten(0.3, buttonColor!),
        color: darken(0.1, buttonColor!),
        [`&.${buttonClasses.root}`]: {
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
              backgroundColor: `${lighten(0.25, buttonColor!)} !important`,
            },
          },
          '&:focus': {
            backgroundColor: 'none !important',
          },
          '&:active': {
            color: darken(0.1, buttonColor!),
            backgroundColor: `${lighten(0.15, buttonColor!)} !important`,
          },
        },
      };

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
        buttonColor && hasButtonColorStyle,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={color}
      variant={'soft'}
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
