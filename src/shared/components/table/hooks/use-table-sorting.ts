import { useEffect, useState } from 'react';
import { TTableHeader } from '@/shared/components';

export function useTableSorting<T>({
  headers,
  dataList,
  isMultipleSorting = false,
}: {
  headers: TTableHeader[];
  dataList: T[];
  isMultipleSorting?: boolean;
}) {
  const [sortedHeaders, setSortedHeaders] = useState(headers);

  useEffect(() => {
    setSortedHeaders(headers);
  }, [headers]);

  const handleSort = (key: string) => {
    setSortedHeaders((prevHeaders) =>
      prevHeaders.map((header) => {
        if (header.id === key) {
          return {
            ...header,
            sorter: {
              ...header.sorter,
              direction:
                header.sorter.direction === 'asc'
                  ? 'desc'
                  : header.sorter.direction === 'desc'
                    ? null
                    : 'asc',
            },
          };
        }

        if (isMultipleSorting) {
          return {
            ...header,
            // sorter: { ...header.sorter, direction: null },
          };
        }

        return {
          ...header,
          sorter: { ...header.sorter, direction: null },
        };
      }),
    );
  };

  const sortedDataList = [...dataList].sort((a, b) => {
    const activeHeader = sortedHeaders.find(
      (header) => header.sorter.sortable && header.sorter.direction !== null,
    );

    if (!activeHeader) return 0;

    const key = activeHeader.id;
    const direction = activeHeader.sorter.direction;
    const aValue = a[key as keyof T];
    const bValue = b[key as keyof T];

    const parseValue = (value: any, locale: string = 'ko') => {
      if (value == null) return { text: '', num: -Infinity };
      if (value instanceof Date) return { text: '', num: value.getTime() };
      if (!isNaN(Number(value))) return { text: '', num: Number(value) };
      if (typeof value === 'string') {
        const match = value.match(/(\D*)(\d+)?/);
        return {
          text: match?.[1]?.toLocaleLowerCase(locale) || '',
          num: match?.[2] ? Number(match[2]) : 0,
        };
      }
      return { text: '', num: 0 };
    };

    const aParsed = parseValue(aValue);
    const bParsed = parseValue(bValue);

    const textComparison = aParsed.text.localeCompare(bParsed.text, 'ko', { sensitivity: 'base' });
    if (textComparison !== 0) {
      return direction === 'asc' ? textComparison : -textComparison;
    }

    return direction === 'asc' ? aParsed.num - bParsed.num : bParsed.num - aParsed.num;
  });

  const resetSort = () => {
    setSortedHeaders((prevHeaders) =>
      prevHeaders.map((header) => {
        return {
          ...header,
          sorter: { ...header.sorter, direction: null },
        };
      }),
    );
  };

  return {
    sortedDataList,
    sortedHeaders,
    handleSort,
    resetSort,
  };
}
