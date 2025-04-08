import type { THeader } from './index.ts';

export const createHeader = <TData>(
  id: 'index' | 'check' | 'button' | Extract<keyof TData, string>,
  label: string,
  width: number,
  extra: Partial<THeader<TData>> = {},
): THeader<TData> => ({
  id,
  label,
  width,
  pin: 'view',
  dataAlign: 'left',
  sorter: { sortable: true, direction: null },
  filter: { filterType: 'text', filterValue: '' },
  ...extra,
});
