import { ButtonHTMLAttributes, ReactNode } from 'react';
import { MotionProps } from 'framer-motion';

export enum ButtonStyle {
  SOLID = 'solid',
  OUTLINED = 'outlined',
}

export type ButtonProps = MotionProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonStyle?: ButtonStyle;
    children: ReactNode;
  };
