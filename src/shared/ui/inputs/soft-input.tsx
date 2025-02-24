import { RefObject } from 'react';
import Input, { InputProps } from '@mui/joy/Input';
import { useColorScheme } from '@mui/joy/styles';

import { colors } from '@/shared/constants';
import { formEnterPrevention } from '@/shared/lib';

interface SoftInputProps extends InputProps {
  inputRef?: RefObject<any>;
  ariaLabel?: string | undefined;
  keydownEnabled?: boolean;
}

export function SoftInput({
  inputRef,
  className,
  sx,
  style = {},
  name = '',
  type = 'text',
  defaultValue,
  value,
  onChange,
  keydownEnabled = false,
  placeholder = '',
  color = 'neutral',
  required = false,
  error = false,
  readOnly = false,
  disabled = false,
  startDecorator,
  endDecorator,
  ariaLabel,
  autoComplete = 'new-password',
  autoFocus,
}: Readonly<SoftInputProps>) {
  const { mode } = useColorScheme();

  const errorStyle = error
    ? {
        border: '2px solid #D32F2F',
      }
    : {};

  const focusedHighlightColor = error ? 'transparent' : `${colors.primary[400]}`;
  let modeBackgroundColor = mode === 'light' ? colors.lightGrey : colors.darkGrey;
  let placeholderColor = undefined;

  if (error) {
    modeBackgroundColor = mode === 'light' ? colors.lightRed : colors.darkGrey;
    placeholderColor = colors.darkGrey;
  }

  return (
    <Input
      ref={inputRef}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={`selection-none ${className}`}
      style={{ ...style, ...errorStyle }}
      sx={[
        {
          transition: 'border-color 0.2s ease-in-out',
          backgroundColor: modeBackgroundColor,
          '&::before': {
            display: 'none',
          },
          '&:focus-within': {
            border: `2px solid ${focusedHighlightColor}`,
          },
          '&:hover': {
            borderColor: error ? modeBackgroundColor : colors.primary[400],
          },
          '& .MuiInput-input::placeholder': {
            color: placeholderColor,
            fontSize: '14px',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      name={name}
      type={type}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant={'soft'}
      color={color}
      onKeyDown={keydownEnabled ? undefined : formEnterPrevention}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      startDecorator={startDecorator}
      endDecorator={endDecorator}
      aria-label={ariaLabel}
    />
  );
}
