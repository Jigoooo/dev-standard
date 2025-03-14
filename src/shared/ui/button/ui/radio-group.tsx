import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { colors } from '@/shared/constants';
import { useWindowsStyle } from '@/shared/hooks';
import { RadioGroupContext, Typography, useRadioGroupContext } from 'shared/ui';

export function RadioGroup({
  name,
  selectedRadio,
  handleSelectedRadio,
  groupDisabled = false,
  children,
}: {
  name: string;
  selectedRadio: string;
  handleSelectedRadio: (value: string) => void;
  groupDisabled?: boolean;
  children: ReactNode;
}) {
  return (
    <RadioGroupContext value={{ name, selectedRadio, handleSelectedRadio, groupDisabled }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </RadioGroupContext>
  );
}

export function Radio({
  label,
  value,
  disabled = false,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  const windowsStyle = useWindowsStyle();

  const { name, selectedRadio, handleSelectedRadio, groupDisabled } = useRadioGroupContext();

  const disabledValue = disabled || groupDisabled;

  return (
    <label
      key={value}
      style={{
        ...{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: disabledValue ? 'not-allowed' : 'pointer',
        },
        ...windowsStyle,
      }}
    >
      <input
        type='radio'
        name={name}
        value={value}
        checked={selectedRadio === value}
        onChange={() => {
          handleSelectedRadio(value);
        }}
        disabled={disabledValue}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '2px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          borderColor: disabledValue
            ? '#cccccc'
            : selectedRadio === value
              ? colors.primary[400]
              : '#cccccc',
        }}
        transition={{ duration: 0.2 }}
      >
        {selectedRadio === value && (
          <motion.div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: disabledValue ? '#cccccc' : colors.primary[400],
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.div>
      <Typography style={{ fontSize: '0.9rem', color: disabledValue ? '#cccccc' : '#333333' }}>
        {label}
      </Typography>
    </label>
  );
}
