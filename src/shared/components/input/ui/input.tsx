import { CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { motion, MotionProps } from 'framer-motion';

import { colors } from '@/shared/constants';
import { useWindowStyle } from '@/shared/hooks';

export enum InputStyle {
  SOFT = 'soft',
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
}

const defaultInputStyle: CSSProperties = {
  width: 'auto',
  paddingInline: 8,
  paddingBlock: 10,
  borderRadius: 4,
  fontSize: '0.9rem',
  fontWeight: 500,
  height: 32,
  outline: 'none',
} as const;

const inputStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#eaeaea',
    border: 'none',
  },
  [InputStyle.OUTLINED]: {
    backgroundColor: '#ffffff',
    boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.34)`,
    border: 'none',
  },
  [InputStyle.UNDERLINE]: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    // borderBottom: `1.4px solid #c4c4c4`,
    border: 'none',
    boxShadow: 'inset 0 -1.4px 0 0 #c4c4c4',
  },
} as const;

const inputDisabledStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#f3f3f3',
  },
  [InputStyle.OUTLINED]: {
    boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.3)`,
    backgroundColor: '#eaeaea',
  },
  [InputStyle.UNDERLINE]: {
    // borderBottom: `2px solid #e1e1e1`,
    boxShadow: 'inset 0 -2px 0 0 #e1e1e1',
  },
} as const;

type ExtendedInputProps = MotionProps &
  InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    isFocusEffect?: boolean;
  };

export function Input({
  style,
  type = 'text',
  inputStyle = InputStyle.OUTLINED,
  startDecorator,
  endDecorator,
  isFocusEffect = true,
  onClick,
  ...props
}: ExtendedInputProps) {
  const windowStyle = useWindowStyle();

  const extraPadding = 30;
  return (
    <div
      style={{
        position: 'relative',
        width: style?.width || 'auto',
      }}
    >
      {startDecorator && (
        <div
          style={{
            position: 'absolute',
            left: inputStyle === InputStyle.UNDERLINE ? 6 : 8,
            top: inputStyle === InputStyle.UNDERLINE ? '40%' : '50%',
            transform: 'translateY(-40%)',
            pointerEvents: 'none',
          }}
        >
          {startDecorator}
        </div>
      )}
      <motion.input
        className='selection-none'
        type={type}
        variants={{
          focus: {
            boxShadow: `inset 0 0 0 2px ${colors.primary[400]}`,
          },
          focusUnderline: {
            // borderBottom: `2px solid ${colors.primary[400]}`,
            boxShadow: `inset 0 -2px 0 0 ${colors.primary[400]}`,
          },
          none: {},
        }}
        whileFocus={
          !isFocusEffect ? 'none' : inputStyle === InputStyle.UNDERLINE ? 'focusUnderline' : 'focus'
        }
        transition={{ duration: 0.1 }}
        style={{
          ...windowStyle,
          ...defaultInputStyle,
          ...inputStyles[inputStyle],
          paddingLeft: startDecorator ? extraPadding : defaultInputStyle.paddingInline,
          paddingRight: endDecorator ? extraPadding : defaultInputStyle.paddingInline,
          ...style,
          ...(props.disabled ? inputDisabledStyles[inputStyle] : {}),
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
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
