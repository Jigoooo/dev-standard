import { motion } from 'framer-motion';
import type { CompositionEvent, KeyboardEvent, CSSProperties } from 'react';
import { useRef } from 'react';

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

export function Textarea({
  ref,
  style,
  isFocusEffect,
  onEnter,
  onKeyDown,
  ...props
}: Readonly<ExtendedTextareaProps>) {
  const windowsStyle = useWindowsStyle();

  const isComposing = useRef(false);

  const handleCompositionStart = (_e: CompositionEvent<HTMLTextAreaElement>) => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (_e: CompositionEvent<HTMLTextAreaElement>) => {
    isComposing.current = false;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (isComposing.current) return;
      e.preventDefault();
      onEnter?.(e);
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <motion.textarea
      ref={ref}
      className='selection-none'
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
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
      whileFocus={isFocusEffect ? 'focus' : 'none'}
      transition={{ duration: 0.1 }}
      {...props}
    />
  );
}
