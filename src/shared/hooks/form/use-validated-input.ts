import { useState, useMemo } from 'react';
import { createValidator } from '@/shared/lib';

interface UseValidatedInputResult {
  value: string;
  error: boolean;
  errorMessage: string;
  isTouched: boolean;
  initialValidate: () => void;
  onChange: (newValue: string) => void;
}

export function useValidatedInput(
  initialValue: string,
  validationRules: (value: string) => ReturnType<typeof createValidator>,
): UseValidatedInputResult {
  const [value, setValue] = useState<string>(initialValue);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const valueWithValidator = useMemo(
    () => validationRules(value).validate(),
    [value, validationRules],
  );

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const initialValidate = () => {
    if (isTouched) {
      setIsTouched(true);
    }
  };

  return {
    value: valueWithValidator.value,
    error: valueWithValidator.error,
    errorMessage: valueWithValidator.errorMessage,
    isTouched,
    initialValidate,
    onChange,
  };
}
