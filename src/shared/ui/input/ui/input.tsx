import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';

import { colors } from '@/shared/constants';
import { useWindowsStyle } from '@/shared/hooks';
import type { ExtendedInputProps } from '../model/input-type.ts';
import { InputStyle } from '../model/input-type.ts';

const defaultInputStyle: CSSProperties = {
  width: 'auto',
  paddingInline: '0.5rem',
  paddingBlock: '0.625rem',
  borderRadius: '0.25rem',
  fontSize: '0.9rem',
  fontWeight: 500,
  height: '2rem',
  outline: 'none',
} as const;

const inputStyles: Record<InputStyle, CSSProperties> = {
  [InputStyle.SOFT]: {
    backgroundColor: '#eaeaea',
    border: 'none',
  },
  [InputStyle.OUTLINED]: {
    backgroundColor: '#ffffff',
    boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.2)`,
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

export function Input({
  ref,
  style,
  type = 'text',
  inputStyle = InputStyle.OUTLINED,
  startDecorator,
  endDecorator,
  isFocusEffect = true,
  onClick,
  ...props
}: ExtendedInputProps) {
  const windowsStyle = useWindowsStyle();

  const extraPadding = '2rem';
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
            display: 'flex',
            alignItems: 'center',
            left: inputStyle === InputStyle.UNDERLINE ? 6 : 8,
            top: inputStyle === InputStyle.UNDERLINE ? '40%' : '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            height: '100%',
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
          ...windowsStyle,
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
            height: '100%',
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          {endDecorator}
        </div>
      )}
    </div>
  );
}
