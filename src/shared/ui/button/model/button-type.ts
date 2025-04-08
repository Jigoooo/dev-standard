import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { MotionProps } from 'framer-motion';
import type { LinkProps } from 'react-router-dom';

export enum ButtonStyle {
  SOLID = 'solid',
  OUTLINED = 'outlined',
}

export type ButtonProps = MotionProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonStyle?: ButtonStyle;
    children: ReactNode;
  };

export type ButtonLinkProps = MotionProps &
  LinkProps & {
    buttonStyle?: ButtonStyle;
    disabled?: boolean;
    children: ReactNode;
  };
