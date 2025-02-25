import { CSSProperties, InputHTMLAttributes, Ref } from 'react';

import { colors } from '@/shared/constants';
import { motion, MotionProps } from 'framer-motion';

export enum InputStyle {
  SOFT = 'soft',
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
}

const defaultInputStyle: CSSProperties = {
  paddingInline: 8,
  paddingBlock: 10,
  borderRadius: 4,
  fontSize: '1rem',
  fontWeight: 500,
  height: 46,
  outline: 'none',
} as const;

const inputStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#cccccc',
    border: 'none',
  },
  [InputStyle.OUTLINED]: {
    backgroundColor: '#ffffff',
    boxShadow: `inset 0 0 0 1px rgba(0,27,55,0.2)`,
    border: 'none',
  },
  [InputStyle.UNDERLINE]: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `1px solid ${colors.primary[400]}`,
  },
} as const;

type InputProps = MotionProps &
  InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement> | null;
    inputStyle?: InputStyle;
  };

export function Input({
  ref,
  style,
  type = 'text',
  inputStyle = InputStyle.OUTLINED,
  ...props
}: InputProps) {
  return (
    <motion.input
      ref={ref}
      className={'selection-none'}
      type={type}
      variants={{
        focus: {
          boxShadow: `inset 0 0 0 2px ${colors.primary[400]}`,
        },
        none: {},
      }}
      whileHover={inputStyle === InputStyle.OUTLINED ? 'hover' : 'none'}
      whileFocus={inputStyle === InputStyle.OUTLINED ? 'focus' : 'none'}
      transition={{ duration: 0.1 }}
      style={{
        ...defaultInputStyle,
        ...inputStyles[inputStyle],
        ...style,
      }}
      {...props}
    />
  );
}
