import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

import type { ExtendedTextareaProps } from '../model/input-type.ts';
import { colors } from '@/shared/constants';
import { useWindowsStyle } from '@/shared/hooks';

const defaultTextareaStyle: CSSProperties = {
  resize: 'vertical',
  paddingInline: '0.5rem',
  paddingBlock: '0.625rem',
  width: '100%',
  height: '6.25rem',
  borderRadius: '0.25rem',
  fontSize: '0.94rem',
  fontWeight: 500,
  boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.3)`,
  border: 'none',
  outline: 'none',
} as const;

const textareaDisabledStyle: CSSProperties = {
  backgroundColor: '#fafafa',
};

export function Textarea({ ref, style, ...props }: Readonly<ExtendedTextareaProps>) {
  const windowsStyle = useWindowsStyle();

  return (
    <motion.textarea
      ref={ref}
      className='selection-none'
      style={{
        ...windowsStyle,
        ...defaultTextareaStyle,
        ...(props.disabled ? textareaDisabledStyle : {}),
        ...style,
      }}
      variants={{
        focus: {
          boxShadow: `inset 0 0 0 2px ${colors.primary[400]}`,
        },
        none: {},
      }}
      whileFocus={'focus'}
      transition={{ duration: 0.1 }}
      {...props}
    />
  );
}
