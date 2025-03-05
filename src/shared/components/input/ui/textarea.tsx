import { motion, MotionProps } from 'framer-motion';
import { CSSProperties, ReactNode, Ref, TextareaHTMLAttributes } from 'react';

import { InputStyle } from '@/shared/components';
import { colors } from '@/shared/constants';

type ExtendedTextareaProps = MotionProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
  };

const defaultTextareaStyle: CSSProperties = {
  resize: 'vertical',
  paddingInline: 8,
  paddingBlock: 10,
  width: '100%',
  height: 100,
  borderRadius: 4,
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
  return (
    <motion.textarea
      ref={ref}
      className='selection-none'
      style={{
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
