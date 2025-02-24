import { useCallback, useState } from 'react';
import { Table } from '@tanstack/react-table';

export function useTableCheckedStates<T, K extends keyof T>({
  tableInstance,
  key,
}: {
  tableInstance: Table<T>;
  key: K;
}) {
  const [checkedStates, setCheckedStates] = useState<(string | number)[]>([]);

  const handleCheck = useCallback((checkState: string | number) => {
    setCheckedStates((prevState) => {
      if (prevState.includes(checkState)) {
        return prevState.filter((state) => state !== checkState);
      }
      return [...prevState, checkState];
    });
  }, []);

  const handleCheckAll = useCallback(() => {
    setCheckedStates((prevState) => {
      if (prevState.length === tableInstance.getFilteredRowModel().rows.length) {
        return [];
      }
      return tableInstance.getFilteredRowModel().rows.map((row) => row.original[key] as unknown as string | number);
    });
  }, [tableInstance, key]);

  return [checkedStates, handleCheck, handleCheckAll] as const;
}
