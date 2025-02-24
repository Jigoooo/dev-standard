import Autocomplete, { AutocompleteProps } from '@mui/joy/Autocomplete';
import { useColorScheme } from '@mui/joy/styles';
import { autocompleteClasses } from '@mui/joy';

import { colors } from '@/shared/constants';
import { formEnterPrevention } from '@/shared/lib';

export function FuturAutoCompleteBox({
  style = {},
  placeholder = '',
  name = '',
  required = false,
  variant = 'soft',
  value = '',
  options = [],
  onChange,
  error = false,
}: Readonly<AutocompleteProps<any, any, any, any>>) {
  const { mode } = useColorScheme();

  const errorStyle = error
    ? {
        border: '2px solid #D32F2F',
      }
    : {};

  const focusedHighlightColor = error ? 'transparent' : 'var(--Input-focusedHighlight)';
  let modeBackgroundColor = mode === 'light' ? colors.lightGrey : colors.darkGrey;
  let placeholderColor = undefined;

  if (error) {
    modeBackgroundColor = colors.lightRed;
    placeholderColor = colors.darkGrey;
  }

  return (
    <Autocomplete
      className={'selection-none'}
      style={{ ...style, ...errorStyle }}
      placeholder={placeholder}
      name={name}
      required={required}
      variant={variant}
      value={value}
      options={options}
      onChange={onChange}
      onKeyDown={formEnterPrevention}
      sx={{
        minWidth: 200,
        backgroundColor: modeBackgroundColor,
        '&::before': {
          display: 'none',
        },
        '&:focus-within': {
          outline: `2px solid ${focusedHighlightColor}`,
        },
        [`& .${autocompleteClasses.input}::placeholder`]: {
          color: placeholderColor,
        },
        '& .MuiAutocomplete-clearIndicator': {
          background: 'none',
          '&:hover, &.Mui-focusVisible': {
            background: 'none',
          },
        },
        '& .MuiAutocomplete-popupIndicator': {
          background: 'none',
          transition: '0.2s',
          '&:hover, &.Mui-focusVisible': {
            background: 'none',
          },
        },
        '&.MuiAutocomplete-popupIndicatorOpen': {
          background: 'none',
          transform: 'rotate(-180deg)',
        },
        [`& .${autocompleteClasses.listbox}`]: {
          backgroundColor: '#fff',
        },
      }}
    />
  );
}
