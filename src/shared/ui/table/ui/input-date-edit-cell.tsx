import { useState } from 'react';
import { toast } from 'sonner';

import type { TEditCell } from '../model/table-type.ts';
import { createValidator } from '@/shared/lib';
import { Input } from '@/shared/ui';

export function InputDateEditCell<TData>({
  inputRef,
  cellData,
  setCellData,
  tableStyle,
  exitEditMode,
}: TEditCell<TData>) {
  const [tempValue, setTempValue] = useState('' + cellData);
  const [originalValue, setOriginalValue] = useState('' + cellData);

  const validateAndSubmit = () => {
    const result = createValidator(tempValue).isDate().validate();
    if (result.error) {
      toast.error(result.errorMessage);
      setTempValue(originalValue);
    } else {
      setOriginalValue(tempValue);
      setCellData(result.value);
      exitEditMode();
    }
  };

  return (
    <Input
      ref={inputRef}
      style={{
        height: tableStyle.tableHeaderHeight,
        fontSize: '0.8rem',
        width: '100%',
        borderRadius: 0,
        boxShadow: 'none',
      }}
      value={tempValue}
      onChange={(event) => setTempValue(event.target.value)}
      onBlur={validateAndSubmit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          exitEditMode();
        }
      }}
    />
  );
}
