import Box from '@mui/joy/Box';
import { Typography } from '@mui/joy';
import { Table } from '@tanstack/react-table';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { IconButton, OutlinedButton, PlainButton, Select } from '@/shared/ui';

export function TablePagination({ table, minWidth }: { table: Table<any>; minWidth: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: minWidth,
        py: 2,
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, gap: 0.7 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 300 }}>전체</Typography>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}> {table.getRowCount()}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, gap: 1.2, mr: 3 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 300 }}>페이지 크기</Typography>
          <Select
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]}
            value={table.getState().pagination.pageSize}
            onChange={(value) => table.setPageSize(Number(value))}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IconButton
            color={'neutral'}
            onClick={() => table.setPageIndex(0)}
            disabled={table.getRowModel().rows.length === 0 || !table.getCanPreviousPage()}
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            color={'neutral'}
            onClick={() => table.previousPage()}
            disabled={table.getRowModel().rows.length === 0 || !table.getCanPreviousPage()}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Box>
        {Array.from({ length: table.getPageCount() }, (_, i) => (i + 1).toString()).map((page) => {
          return (
            <Box key={page} sx={{ display: 'flex', alignItems: 'center' }}>
              {(table.getState().pagination.pageIndex + 1).toString() === page ? (
                <OutlinedButton
                  onClick={() => {
                    table.setPageIndex(Number(page) - 1);
                  }}
                  sx={{
                    borderRadius: 18,
                    minHeight: 0,
                    height: 35,
                    width: 35,
                  }}
                >
                  {page}
                </OutlinedButton>
              ) : (
                <PlainButton
                  onClick={() => {
                    table.setPageIndex(Number(page) - 1);
                  }}
                  sx={{
                    borderRadius: 18,
                    minHeight: 0,
                    height: 35,
                    width: 35,
                  }}
                  color='neutral'
                >
                  {page}
                </PlainButton>
              )}
            </Box>
          );
        })}
        <Box sx={{ display: 'flex' }}>
          <IconButton
            color={'neutral'}
            onClick={() => table.nextPage()}
            disabled={table.getRowModel().rows.length === 0 || !table.getCanNextPage()}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            color={'neutral'}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={table.getRowModel().rows.length === 0 || !table.getCanNextPage()}
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
