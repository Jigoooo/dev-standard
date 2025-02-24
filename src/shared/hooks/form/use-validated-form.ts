import { useState, useMemo } from 'react';
import { createValidator } from '@/shared/lib';

type ValidationRule<T> = (value: T) => ReturnType<typeof createValidator>;

interface FieldValidation<T> {
  value: T;
  error: boolean;
  errorMessage: string;
  isTouched: boolean;
}

interface UseValidatedFormResult<T> {
  values: T;
  errors: { [K in keyof T]: boolean };
  errorMessages: { [K in keyof T]: string };
  isTouched: { [K in keyof T]: boolean };
  initValues: () => void;
  onChange: (field: keyof T, newValue: T[keyof T]) => void;
  hasErrors: () => boolean;
}

export function useValidatedForm<T extends { [key: string]: any }>(
  initialValues: T,
  validationRules: { [K in keyof T]: ValidationRule<T[K]> },
): UseValidatedFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [isTouched, setIsTouched] = useState<{ [K in keyof T]: boolean }>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as { [K in keyof T]: boolean },
    ),
  );

  const validatedFields = useMemo(() => {
    return Object.keys(values).reduce(
      (acc, key) => {
        const fieldKey = key as keyof T;
        const validationResult = validationRules[fieldKey](values[fieldKey]).validate();
        acc[fieldKey] = {
          value: values[fieldKey],
          error: validationResult.error,
          errorMessage: validationResult.errorMessage,
          isTouched: isTouched[fieldKey],
        };
        return acc;
      },
      {} as { [K in keyof T]: FieldValidation<T[K]> },
    );
  }, [values, validationRules, isTouched]);

  const initialValidate = () => {
    setIsTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as { [K in keyof T]: boolean },
      ),
    );
  };

  const errors = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(validatedFields).map((key) => [key, validatedFields[key as keyof T].error]),
      ) as { [K in keyof T]: boolean },
    [validatedFields],
  );

  const hasErrors = () => {
    initialValidate();
    return Object.values(errors).some((error) => error);
  };

  const onChange = (field: keyof T, newValue: T[keyof T]) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: newValue,
    }));
    setIsTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  };

  const initValues = () => {
    setIsTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as { [K in keyof T]: boolean },
      ),
    );
    setValues(initialValues);
  };

  return {
    values,
    errors: Object.fromEntries(
      Object.keys(validatedFields).map((key) => [key, validatedFields[key as keyof T].error]),
    ) as { [K in keyof T]: boolean },
    errorMessages: Object.fromEntries(
      Object.keys(validatedFields).map((key) => [
        key,
        validatedFields[key as keyof T].errorMessage,
      ]),
    ) as { [K in keyof T]: string },
    isTouched,
    initValues,
    onChange,
    hasErrors,
  };
}
