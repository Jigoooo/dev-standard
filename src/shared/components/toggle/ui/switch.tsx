import { motion } from 'framer-motion';
import { CSSProperties } from 'react';
import { colors } from '@/shared/constants';

interface FramerMotionSwitchProps {
  containerStyle?: CSSProperties;
  label?: string;
  labelStyle?: CSSProperties;
  isOn: boolean;
  onClick: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export function Switch({
  containerStyle,
  label,
  labelStyle,
  isOn,
  onClick,
  width = 38,
  height = 22,
  disabled = false,
}: FramerMotionSwitchProps) {
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
        ...containerStyle,
      }}
    >
      {label && (
        <span
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
        </span>
      )}
      <div
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
        onClick={disabled ? undefined : onClick}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 35,
          }}
          style={{
            width: circleSize,
            height: circleSize,
            backgroundColor: 'white',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
}
