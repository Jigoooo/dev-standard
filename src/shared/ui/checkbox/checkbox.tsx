import { Box, Typography } from '@mui/joy';
import { motion, AnimatePresence } from 'framer-motion';
import { MouseEventHandler } from 'react';

import CheckSolid from '@/shared/assets/images/check-solid.svg?react';

import { colors } from '@/shared/constants';

export function Checkbox({
  label = '',
  checked,
  isPartial = false,
  onClick,
  disabled = false,
}: {
  label?: string;
  checked: boolean;
  isPartial?: boolean;
  onClick: MouseEventHandler;
  disabled?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
      }}
      onClick={(e) => !disabled && onClick(e)}
    >
      <Box
        component='input'
        type='checkbox'
        checked={checked}
        onChange={() => {}}
        sx={{ display: 'none' }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 20,
          height: 20,
          border: `1px solid ${!disabled && checked ? colors.primary[400] : '#cccccc'}`,
          borderRadius: 4,
          backgroundColor: disabled ? '#f5f5f5' : checked ? colors.primary[400] : '#ffffff',
          '&:hover': {
            borderColor: checked ? 'none' : colors.primary[400],
            backgroundColor: checked ? 'none' : '#ffffff',
          },
          transition: 'all 0.2s',
        }}
      >
        <AnimatePresence mode={'wait'}>
          {!disabled && checked && (
            <Box
              component={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              sx={{
                display: 'flex',
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
            </Box>
          )}
          {isPartial && (
            <Box
              component={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box sx={{ width: 10, height: 10, backgroundColor: colors.primary[400] }} />
            </Box>
          )}
        </AnimatePresence>
      </Box>
      <Typography sx={{ userSelect: 'none' }}>{label}</Typography>
    </Box>
  );
}
