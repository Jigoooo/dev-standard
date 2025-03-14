import { useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { ColumnValueFunction, Typography, UseTableInstanceProps } from 'shared/ui';

export function useTableInstance<TColumnData>({
  data,
  columnConfig,
  pageCount,
  paginationOptions,
  onPaginationChange,
  columnVisibility = {},
  otherColumnWidth = 130,
}: UseTableInstanceProps<TColumnData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = () => {
    const columnHelper = createColumnHelper<TColumnData>();

    return (Object.keys(columnConfig) as (keyof TColumnData)[])
      .map((accessorKey) => {
        const columnKey = accessorKey as keyof TColumnData;

        if (!columnConfig[columnKey]) {
          return null;
        }

        const columnValue: ColumnValueFunction<TColumnData> | keyof TColumnData = columnConfig[
          columnKey
        ].customRender
          ? (row: TColumnData) => columnConfig[columnKey]?.customRender?.(row) ?? ''
          : accessorKey;

        return columnHelper.accessor(columnValue as any, {
          id: accessorKey as string,
          header: () => <Typography>{columnConfig[columnKey]!.header}</Typography>,
          size: columnConfig[columnKey]!.size,
          cell: (info) => info.getValue(),
        });
      })
      .filter((column) => column !== null);
  };

  const tableInstance = useReactTable({
    data,
    columns: columns(),
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      pagination: paginationOptions,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange,
    onSortingChange: setSorting,
    manualPagination: true,
    debugTable: true,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
  });

  const paginatedSizeChange = (newPageSize: number) => {
    tableInstance.setPageSize(newPageSize);
  };

  const tableWidth =
    tableInstance
      .getAllColumns()
      .map((column) => column.getSize())
      .reduce((a, b) => a + b, 0) + otherColumnWidth;

  const sheetMinWidth = tableWidth / 1.5;

  return { tableInstance, paginatedSizeChange, tableWidth, sheetMinWidth };
}
