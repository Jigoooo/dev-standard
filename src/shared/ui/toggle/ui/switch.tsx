import { LayoutGroup, motion } from 'framer-motion';

import { colors } from '@/shared/constants';
import { Typography } from '@/shared/ui';
import { SwitchProps } from '../model/toggle-type.ts';

export function Switch({
  containerStyle,
  label,
  labelStyle,
  isOn,
  onClick,
  width = 34,
  height = 18,
  disabled = false,
}: SwitchProps) {
  const padding = height * 0.15;
  const circleSize = height * 0.7;
  const borderRadius = height / 2;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...containerStyle,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {label && (
        <Typography
          style={{
            ...{
              userSelect: 'none',
              fontSize: '0.9rem',
              color: disabled ? '#9f9f9f' : '#666666',
              fontWeight: 500,
            },
            ...labelStyle,
          }}
        >
          {label}
        </Typography>
      )}
      <LayoutGroup>
        <motion.div
          layout
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) {
              onClick();
            }
          }}
          style={{
            display: 'flex',
            width,
            height,
            borderRadius,
            backgroundColor: disabled ? '#e0e0e0' : isOn ? colors.primary[400] : '#999999',
            padding,
            cursor: disabled ? 'not-allowed' : 'pointer',
            justifyContent: isOn ? 'flex-end' : 'flex-start',
            alignItems: 'center',
          }}
        >
          <motion.div
            layoutId='switch-thumb'
            transition={{ type: 'spring', stiffness: 700, damping: 35 }}
            style={{
              width: circleSize,
              height: circleSize,
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
