import { motion } from 'framer-motion';
import { type CSSProperties, isValidElement, type MouseEvent, useRef, useState } from 'react';
import { darken, lighten } from 'polished';
import { Link } from 'react-router-dom';

import { isLightColor } from '@/shared/lib';
import { colors } from '@/shared/constants';
import { Typography } from '@/shared/ui';
import { useWindowsStyle } from '@/shared/hooks';
import { ButtonStyle, type ButtonLinkProps } from '../model/button-type.ts';

const MotionLink = motion.create(Link);

const defaultButtonLinkStyle: CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: '0.8rem',
  paddingBlock: '0.2rem',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.84rem',
  fontWeight: 500,
  height: '2rem',
  lineHeight: 0,
} as const;

const buttonLinkStyles: Record<ButtonStyle, CSSProperties> = {
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

const buttonLinkDisabledStyle: Record<ButtonStyle, CSSProperties> = {
  [ButtonStyle.SOLID]: {
    cursor: 'not-allowed',
    backgroundColor: '#eeeeee',
    color: '#aaaaaa',
  },
  [ButtonStyle.OUTLINED]: {
    cursor: 'not-allowed',
    backgroundColor: '#eeeeee',
    borderColor: '#bebebe',
    color: '#bbbbbb',
  },
} as const;

const getAnimationBackgroundColor = (
  buttonStyle: ButtonStyle,
  animationColor: string,
): { hoverBackgroundColor: string; tapBackgroundColor: string } => {
  switch (buttonStyle) {
    case ButtonStyle.SOLID: {
      return {
        hoverBackgroundColor: isLightColor(animationColor)
          ? darken(0.1, animationColor)
          : lighten(0.1, animationColor),
        tapBackgroundColor: darken(0.2, animationColor),
      };
    }
    case ButtonStyle.OUTLINED: {
      return {
        hoverBackgroundColor: isLightColor(animationColor)
          ? lighten(0.24, animationColor)
          : lighten(0.54, animationColor),
        tapBackgroundColor: isLightColor(animationColor)
          ? lighten(0.28, animationColor)
          : lighten(0.5, animationColor),
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

export function ButtonLink({
  buttonStyle = ButtonStyle.SOLID,
  children,
  style,
  onClick,
  disabled = false,
  ...props
}: ButtonLinkProps) {
  const [isPressed, setIsPressed] = useState(false);
  const windowsStyle = useWindowsStyle();

  const anchorRef = useRef<HTMLAnchorElement>(null);

  const isInside = (e: MouseEvent<HTMLAnchorElement>) => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    }
    return false;
  };

  const backgroundColor = style?.backgroundColor ?? colors.primary[400];
  const color = style?.color ?? colors.primary[400];
  const animationColor = buttonStyle === ButtonStyle.OUTLINED ? color : backgroundColor;

  const animationBackgroundColor = getAnimationBackgroundColor(buttonStyle, animationColor);

  const handleMouseDown = (e: MouseEvent<HTMLAnchorElement>) => {
    setIsPressed(true);

    if (props.onMouseDown) {
      props.onMouseDown(e);
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    setIsPressed(false);

    if (props.onMouseLeave) {
      props.onMouseLeave(e);
    }
  };
  const handleMouseUp = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isPressed && isInside(e) && onClick) {
      onClick(e);
    }
    setIsPressed(false);

    if (props.onMouseUp) {
      props.onMouseUp(e);
    }
  };

  return (
    <MotionLink
      ref={anchorRef}
      className='selection-none'
      style={{
        transformOrigin: 'center center',
        ...defaultButtonLinkStyle,
        ...buttonLinkStyles[buttonStyle],
        ...(disabled ? buttonLinkDisabledStyle[buttonStyle] : {}),
        ...windowsStyle,
        ...style,
      }}
      variants={{
        hover: { backgroundColor: animationBackgroundColor.hoverBackgroundColor },
        tap: { backgroundColor: animationBackgroundColor.tapBackgroundColor, scale: 0.98 },
        none: {},
      }}
      whileHover={disabled ? 'none' : 'hover'}
      whileTap={disabled ? 'none' : 'tap'}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClickCapture={(event) => event.stopPropagation()}
      {...props}
    >
      {isValidElement(children) ? children : <Typography>{children}</Typography>}
    </MotionLink>
  );
}
