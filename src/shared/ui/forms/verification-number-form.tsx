import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/joy';

import { colors } from '@/shared/constants';

export function VerificationNumberForm({
  disabled = false,
  numberArrLength,
  numberBoxSize = 50,
  numberBoxBorderRadius = 12,
  boxGap = 1.6,
  value = [],
  onChange,
  onComplete,
}: {
  disabled?: boolean;
  numberArrLength: number;
  numberBoxSize?: number;
  numberBoxBorderRadius?: number;
  boxGap?: number;
  value: number[];
  onChange: (value: number[]) => void;
  onComplete?: (setCompleteState: (completeState: boolean) => void) => void;
}) {
  const [completeColor, setCompleteColor] = useState('#cccccc');

  const handleVerificationCode = useCallback(
    (newValue: number) => {
      if (value.length < numberArrLength && !disabled) {
        const newVerificationCode = [...value, newValue];
        onChange(newVerificationCode);
      }
    },
    [disabled, numberArrLength, value, onChange],
  );

  const handleDeleteCode = useCallback(() => {
    if (disabled) {
      return;
    }

    const newVerificationCode = value.slice(0, -1);
    onChange(newVerificationCode);
    setCompleteColor('#cccccc');
  }, [disabled, value, onChange]);

  useEffect(() => {
    if (value.length === numberArrLength && onComplete) {
      onComplete((completeState) => {
        if (completeState) {
          setCompleteColor(colors.primary[500]);
        } else {
          setCompleteColor('crimson');
        }
      });
    }
  }, [value, numberArrLength, onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        handleVerificationCode(Number(event.key));
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        handleDeleteCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDeleteCode, handleVerificationCode]);

  return (
    <Box className={'selection-none'} sx={{ display: 'flex', width: '100%', gap: boxGap, alignItems: 'center' }}>
      {[...Array(numberArrLength)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: numberBoxSize,
            height: numberBoxSize,
            borderRadius: numberBoxBorderRadius,
            border: 'none',
            boxShadow: `inset 0 0 0 2px ${value.length === numberArrLength ? completeColor : value.length - 1 === index ? colors.primary[500] : '#cccccc'}`,
            transition: 'box-shadow 0.2s ease-in-out',
            backgroundColor: disabled ? '#f0f0f0' : 'transparent',
          }}
        >
          <Typography sx={{ fontSize: '1.6rem', color: colors.primary[500], fontWeight: 700 }}>
            {value[index] !== undefined ? value[index] : ''}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
