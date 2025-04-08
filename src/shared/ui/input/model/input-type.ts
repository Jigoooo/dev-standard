import type { MotionProps } from 'framer-motion';
import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react';

export enum InputStyle {
  SOFT = 'soft',
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
}

export type ExtendedInputProps = MotionProps &
  InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    isFocusEffect?: boolean;
  };

export type ExtendedTextareaProps = MotionProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
  };
