export type SelectOption<ValueType extends string | number> = {
  label: string;
  value: ValueType;
};

export type MultiSelectOption = {
  label: string;
  value: string | number;
};

export type TimePart = 'hours' | 'minutes' | 'seconds';
