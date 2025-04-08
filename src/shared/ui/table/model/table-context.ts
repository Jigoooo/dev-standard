import type { Usable } from 'react';
import { createContext, use } from 'react';

import type { TTableContext } from './table-type.ts';

export const TableContext = createContext<TTableContext<any> | null>(null);
export const useTableContext = <TData extends Record<string, any>>() => {
  const tableContext = use(TableContext as Usable<TTableContext<TData>>);

  if (tableContext === null) {
    throw new Error('Table context is null. Please check the Table context ');
  }

  return tableContext;
};
