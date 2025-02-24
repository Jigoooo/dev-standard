import Button from '@mui/joy/Button';
import { buttonClasses, ButtonProps } from '@mui/joy';
import { lighten } from 'polished';
import { colors } from '@/shared/constants';
import { isLightColor } from '@/shared/lib';

interface FuturButtonProps extends ButtonProps {
  noAnimation?: boolean;
  buttonColor?: string;
}

export function OutlinedButton({
  children = '',
  sx = [],
  noAnimation = true,
  type = 'button',
  fullWidth = false,
  onClick,
  buttonColor = colors.primary[400],
  color,
  loading,
  disabled = false,
  startDecorator,
  endDecorator,
}: Readonly<FuturButtonProps>) {
  const hoverColor = isLightColor(buttonColor)
    ? lighten(0.28, buttonColor)
    : lighten(0.36, buttonColor);

  const activeColor = isLightColor(buttonColor)
    ? lighten(0.32, buttonColor)
    : lighten(0.34, buttonColor);

  return (
    <Button
      className={'selection-none'}
      disabled={disabled}
      tabIndex={-1}
      sx={[
        noAnimation
          ? {}
          : {
              transition: '0.1s',
            },
        {
          width: 'auto',
          height: 38,
          paddingTop: 1.0,
          fontSize: '0.94rem',
        },
        buttonColor && {
          borderColor: buttonColor,
          color: buttonColor,
          [`&.${buttonClasses.root}`]: {
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': {
                backgroundColor: `${hoverColor} !important`,
              },
            },
            '&:focus': {
              backgroundColor: 'none !important',
            },
            '&:active': {
              backgroundColor: `${activeColor} !important`,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={color}
      variant={'outlined'}
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
