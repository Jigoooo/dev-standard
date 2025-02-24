import { Key } from 'react';
import { Radio, RadioGroup, RadioGroupProps, RadioProps } from '@mui/joy';

interface FuturRadioOptionProps extends RadioProps {
  key: Key;
}

interface FuturRadioGroupProps extends RadioGroupProps {
  options: FuturRadioOptionProps[];
}

export function FuturRadioGroup({
  defaultValue = '',
  name = '',
  orientation = 'horizontal',
  options = [],
  color,
}: Readonly<FuturRadioGroupProps>) {
  return (
    <RadioGroup
      className={'selection-none'}
      defaultValue={defaultValue}
      name={name}
      orientation={orientation}
    >
      {options.map((value) => {
        return (
          <Radio
            key={value.key}
            label={value.label}
            value={value.value}
            onChange={value.onChange}
            variant='soft'
            color={color}
            sx={{ fontFamily: 'Pretendard' }}
          />
        );
      })}
    </RadioGroup>
  );
}
