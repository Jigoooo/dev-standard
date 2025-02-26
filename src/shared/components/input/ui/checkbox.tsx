import { motion, AnimatePresence } from 'framer-motion';
import { MouseEventHandler } from 'react';

import CheckSolid from '@/shared/assets/images/check-solid.svg?react';

import { colors } from '@/shared/constants';
import { FlexRow } from '@/shared/components';

export function Checkbox({
  label = '',
  checked,
  color = colors.primary[400],
  isPartial = false,
  onClick,
  disabled = false,
}: {
  label?: string;
  checked: boolean;
  color?: string;
  isPartial?: boolean;
  onClick: MouseEventHandler;
  disabled?: boolean;
}) {
  return (
    <FlexRow
      style={{
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
      }}
      onClick={(e) => !disabled && onClick(e)}
    >
      <input type='checkbox' checked={checked} onChange={() => {}} style={{ display: 'none' }} />
      <FlexRow
        as={motion.div}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 20,
          height: 20,
          border: `1px solid ${!disabled && checked ? color : '#cccccc'}`,
          borderRadius: 4,
          backgroundColor: disabled ? '#f5f5f5' : checked ? color : '#ffffff',
        }}
        variants={{
          hover: {
            borderColor: color,
            backgroundColor: '#ffffff',
          },
          none: {},
        }}
        whileHover={checked ? 'none' : 'hover'}
        transition={{
          duration: 0.2,
        }}
      >
        <AnimatePresence mode={'wait'}>
          {!disabled && checked && (
            <FlexRow
              as={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CheckSolid
                style={{
                  width: 14,
                  height: 14,
                  fill: '#ffffff',
                  stroke: '#ffffff',
                  strokeWidth: 30,
                }}
              />
            </FlexRow>
          )}
          {isPartial && (
            <FlexRow
              as={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: 10, height: 10, backgroundColor: color }} />
            </FlexRow>
          )}
        </AnimatePresence>
      </FlexRow>
      <span
        style={{
          userSelect: 'none',
          fontSize: '0.9rem',
          color: disabled ? '#999999' : '#666666',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </FlexRow>
  );
}
