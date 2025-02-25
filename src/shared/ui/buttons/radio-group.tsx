import { motion } from 'framer-motion';
import { createContext, ReactNode, use } from 'react';
import { colors } from '@/shared/constants';

const RadioGroupContext = createContext<
  { name: string; selectedRadio: string; handleSelectedRadio: (value: string) => void } | undefined
>(undefined);

function useRadioGroupContext() {
  const context = use(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
}

export function RadioGroup({
  name,
  selectedRadio,
  handleSelectedRadio,
  children,
}: {
  name: string;
  selectedRadio: string;
  handleSelectedRadio: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <RadioGroupContext value={{ name, selectedRadio, handleSelectedRadio }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </RadioGroupContext>
  );
}

export function Radio({ label, value }: { label: string; value: string }) {
  const { name, selectedRadio, handleSelectedRadio } = useRadioGroupContext();

  return (
    <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input
        type='radio'
        name={name}
        value={value}
        checked={selectedRadio === value}
        onChange={() => handleSelectedRadio(value)}
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
          borderColor: selectedRadio === value ? colors.primary[400] : '#ccc',
        }}
        transition={{ duration: 0.2 }}
      >
        {selectedRadio === value && (
          <motion.div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: colors.primary[400],
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.div>
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </label>
  );
}
