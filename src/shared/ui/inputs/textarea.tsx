import { motion, MotionProps } from 'framer-motion';
import { CSSProperties, ReactNode, Ref, TextareaHTMLAttributes } from 'react';

import { InputStyle } from '@/shared/ui';
import { colors } from '@/shared/constants';

type ExtendedTextareaProps = MotionProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement> | null;
    inputStyle?: InputStyle;
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
  };

const defaultTextareaStyle: CSSProperties = {
  width: '100%',
  height: 100,
  borderRadius: 4,
  boxShadow: `inset 0 0 0 0.8px rgba(0,27,55,0.3)`,
  border: 'none',
  outline: 'none',
} as const;

export function Textarea({ ...props }: Readonly<ExtendedTextareaProps>) {
  return (
    <motion.textarea
      className='selection-none'
      style={{
        ...defaultTextareaStyle,
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
