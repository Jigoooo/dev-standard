import { RefObject } from 'react';
import Input, { InputProps } from '@mui/joy/Input';

import { colors } from '@/shared/constants';
import { formEnterPrevention } from '@/shared/lib';

interface UnderlineInputProps extends InputProps {
  inputRef?: RefObject<any>;
  ariaLabel?: string | undefined;
  keydownEnabled?: boolean;
}

export function UnderlineInput({
  inputRef,
  className,
  sx,
  style = {},
  name = '',
  type = 'text',
  defaultValue,
  value,
  onChange,
  onKeyDown,
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
}: Readonly<UnderlineInputProps>) {
  let placeholderColor = undefined;

  if (error) {
    placeholderColor = colors.darkGrey;
  }

  return (
    <Input
      ref={inputRef}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={`selection-none ${className}`}
      style={{ ...style }}
      sx={[
        {
          background: 'none',
          lineHeight: 1,
          paddingInline: 0.5,
          '--Input-radius': '0px',
          borderBottom: '2px solid',
          borderColor: 'neutral.outlinedBorder',
          '&:hover': {
            borderColor: 'neutral.outlinedHoverBorder',
          },
          '&::before': {
            border: '1px solid var(--Input-focusedHighlight)',
            transform: 'scaleX(0)',
            left: 0,
            right: 0,
            bottom: '-2px',
            top: 'unset',
            transition: 'transform .14s cubic-bezier(0.1,0.9,0.2,1)',
            borderRadius: 0,
          },
          '&:focus-within::before': {
            transform: 'scaleX(1)',
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
      variant={'plain'}
      color={color}
      onKeyDown={keydownEnabled ? onKeyDown : formEnterPrevention}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      startDecorator={startDecorator}
      endDecorator={endDecorator}
      aria-label={ariaLabel}
    />
  );
}
