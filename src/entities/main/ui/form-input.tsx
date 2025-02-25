import { ChangeEventHandler } from 'react';
import { CustomedFormControl, Input } from '@/shared/ui';

export function FormInput({
  label,
  required = false,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <CustomedFormControl sx={{ flex: 1 }} label={label} required={required}>
      <Input style={{ height: 38 }} value={value} onChange={onChange} />
    </CustomedFormControl>
  );
}
