import { createContext, use } from 'react';

export const RadioGroupContext = createContext<
  | {
      name: string;
      selectedRadio: string;
      handleSelectedRadio: (value: string) => void;
      groupDisabled: boolean;
    }
  | undefined
>(undefined);

export function useRadioGroupContext() {
  const context = use(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
}
