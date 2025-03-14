import { useEffect, useState } from 'react';

import { THeader } from 'shared/ui';

export function useTableSorting<TData>({
  headers,
  dataList,
  isMultipleSorting = false,
}: {
  headers: THeader<TData>[];
  dataList: TData[];
  isMultipleSorting?: boolean;
}) {
  const [sortState, setSortState] = useState<Record<string, 'asc' | 'desc' | null>>({});
  const [sortedDataList, setSortedDataList] = useState<TData[]>([...dataList]);

  const sortedHeaders = headers.map((header) => ({
    ...header,
    sorter: {
      ...header.sorter,
      direction:
        sortState[header.id] !== undefined
          ? sortState[header.id]
          : header.sorter?.direction || null,
    },
  }));

  const handleSort = (key: string) => {
    const targetHeader = headers.find((header) => header.id === key);
    if (!targetHeader || !targetHeader.sorter?.sortable) {
      return;
    }

    // 새로운 방향 계산: asc -> desc -> null -> asc
    const newDirection: 'asc' | 'desc' | null =
      sortState[key] === 'asc' ? 'desc' : sortState[key] === 'desc' ? null : 'asc';

    setSortState((prev) => ({
      ...prev,
      [key]: newDirection,
    }));

    if (isMultipleSorting) {
      setSortState((prev) => ({
        ...prev,
        [key]: newDirection,
      }));
    } else {
      const newState: Record<string, 'asc' | 'desc' | null> = {};
      headers.forEach((header) => {
        newState[header.id] = header.id === key ? newDirection : null;
      });
      setSortState(newState);
    }
  };

  // const sortedDataList = useMemo(() => {
  //   return [...dataList].sort((a, b) => {
  //     const activeHeader = sortedHeaders.find(
  //       (header) => header.sorter?.sortable && header.sorter.direction !== null,
  //     );
  //
  //     if (!activeHeader) return 0;
  //
  //     const key = activeHeader.id;
  //     const direction = activeHeader.sorter.direction;
  //     const aValue = a[key as keyof T];
  //     const bValue = b[key as keyof T];
  //
  //     const parseValue = (value: any, locale: string = 'ko') => {
  //       if (value == null) return { text: '', num: -Infinity };
  //       if (value instanceof Date) return { text: '', num: value.getTime() };
  //       if (!isNaN(Number(value))) return { text: '', num: Number(value) };
  //       if (typeof value === 'string') {
  //         const match = value.match(/(\D*)(\d+)?/);
  //         return {
  //           text: match?.[1]?.toLocaleLowerCase(locale) || '',
  //           num: match?.[2] ? Number(match[2]) : 0,
  //         };
  //       }
  //       return { text: '', num: 0 };
  //     };
  //
  //     const aParsed = parseValue(aValue);
  //     const bParsed = parseValue(bValue);
  //
  //     const textComparison = aParsed.text.localeCompare(bParsed.text, 'ko', {
  //       sensitivity: 'base',
  //     });
  //     if (textComparison !== 0) {
  //       return direction === 'asc' ? textComparison : -textComparison;
  //     }
  //
  //     return direction === 'asc' ? aParsed.num - bParsed.num : bParsed.num - aParsed.num;
  //   });
  // }, [dataList, sortedHeaders]);

  useEffect(() => {
    const sorted = [...dataList].sort((a, b) => {
      const activeHeader = sortedHeaders.find(
        (header) => header.sorter?.sortable && header.sorter.direction !== null,
      );

      if (!activeHeader) return 0;

      const key = activeHeader.id;
      const direction = activeHeader.sorter.direction;
      const aValue = a[key as keyof TData];
      const bValue = b[key as keyof TData];

      const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
      const cmp = collator.compare(String(aValue), String(bValue));
      return direction === 'asc' ? cmp : -cmp;
    });

    setSortedDataList(sorted);
  }, [dataList, sortedHeaders]);

  const resetSort = () => {
    setSortState({});
  };

  return {
    sortedDataList,
    sortedHeaders,
    handleSort,
    resetSort,
  };
}
