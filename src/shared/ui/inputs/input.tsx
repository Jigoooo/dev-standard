import { CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { motion, MotionProps } from 'framer-motion';

import { colors } from '@/shared/constants';

export enum InputStyle {
  SOFT = 'soft',
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
}

const defaultInputStyle: CSSProperties = {
  paddingInline: 8,
  paddingBlock: 10,
  borderRadius: 4,
  fontSize: '0.94rem',
  fontWeight: 500,
  height: 38,
  outline: 'none',
} as const;

const inputStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#eaeaea',
    border: 'none',
  },
  [InputStyle.OUTLINED]: {
    backgroundColor: '#ffffff',
    boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.3)`,
    border: 'none',
  },
  [InputStyle.UNDERLINE]: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `1.4px solid #c4c4c4`,
  },
} as const;

const inputDisabledStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#f3f3f3',
  },
  [InputStyle.OUTLINED]: {
    backgroundColor: '#fafafa',
  },
  [InputStyle.UNDERLINE]: {
    borderBottom: `2px solid #e1e1e1`,
  },
} as const;

type ExtendedInputProps = MotionProps &
  InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
  };

export function Input({
  ref,
  style,
  type = 'text',
  inputStyle = InputStyle.OUTLINED,
  startDecorator,
  endDecorator,
  ...props
}: ExtendedInputProps) {
  const extraPadding = 28;
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {startDecorator && (
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-40%)',
            pointerEvents: 'none',
          }}
        >
          {startDecorator}
        </div>
      )}
      <motion.input
        ref={ref}
        className='selection-none'
        type={type}
        variants={{
          focus: {
            boxShadow: `inset 0 0 0 2px ${colors.primary[400]}`,
          },
          focusUnderline: {
            borderBottom: `2px solid ${colors.primary[400]}`,
          },
          none: {},
        }}
        whileFocus={inputStyle === InputStyle.UNDERLINE ? 'focusUnderline' : 'focus'}
        transition={{ duration: 0.1 }}
        style={{
          ...defaultInputStyle,
          ...inputStyles[inputStyle],
          ...style,
          width: '100%',
          paddingLeft: startDecorator ? extraPadding : defaultInputStyle.paddingInline,
          paddingRight: endDecorator ? extraPadding : defaultInputStyle.paddingInline,
          ...(props.disabled ? inputDisabledStyles[inputStyle] : {}),
        }}
        {...props}
      />
      {endDecorator && (
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-40%)',
            pointerEvents: 'none',
          }}
        >
          {endDecorator}
        </div>
      )}
    </div>
  );
}
