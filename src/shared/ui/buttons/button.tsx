import { motion, MotionProps } from 'framer-motion';
import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { darken, lighten } from 'polished';

import { isLightColor } from '@/shared/lib';
import { colors } from '@/shared/constants';

export enum ButtonStyle {
  SOLID = 'solid',
  OUTLINED = 'outlined',
}

const defaultButtonStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: 12,
  paddingBlock: 4,
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 600,
  height: 46,
  lineHeight: 0,
} as const;

const buttonStyles: Record<ButtonStyle, CSSProperties> = {
  [ButtonStyle.SOLID]: {
    backgroundColor: colors.primary[400],
    color: 'white',
    border: 'none',
  },
  [ButtonStyle.OUTLINED]: {
    backgroundColor: '#ffffff',
    color: colors.primary[400],
    border: `1px solid ${colors.primary[400]}`,
  },
} as const;

const getAnimationBackgroundColor = (
  buttonStyle: ButtonStyle,
  animationColor: string,
): { hoverBackgroundColor: string; tapBackgroundColor: string } => {
  switch (buttonStyle) {
    case ButtonStyle.SOLID: {
      return {
        hoverBackgroundColor: darken(0.1, animationColor),
        tapBackgroundColor: darken(0.2, animationColor),
      };
    }
    case ButtonStyle.OUTLINED: {
      return {
        hoverBackgroundColor: isLightColor(animationColor)
          ? lighten(0.24, animationColor)
          : lighten(0.42, animationColor),
        tapBackgroundColor: isLightColor(animationColor)
          ? lighten(0.28, animationColor)
          : lighten(0.4, animationColor),
      };
    }
    default: {
      return {
        hoverBackgroundColor: darken(0.1, animationColor),
        tapBackgroundColor: darken(0.2, animationColor),
      };
    }
  }
};

type ButtonProps = MotionProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonStyle?: ButtonStyle;
    children: ReactNode;
  };

export function Button({
  buttonStyle = ButtonStyle.SOLID,
  children,
  style,
  ...props
}: ButtonProps) {
  const backgroundColor = style?.backgroundColor ?? colors.primary[400];
  const color = style?.color ?? colors.primary[400];
  const animationColor = buttonStyle === ButtonStyle.OUTLINED ? color : backgroundColor;

  const animationBackgroundColor = getAnimationBackgroundColor(buttonStyle, animationColor);

  return (
    <motion.button
      className={'selection-none'}
      style={{ ...defaultButtonStyle, ...buttonStyles[buttonStyle], ...style }}
      whileHover={{ backgroundColor: animationBackgroundColor.hoverBackgroundColor }}
      whileTap={{ backgroundColor: animationBackgroundColor.tapBackgroundColor, scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
