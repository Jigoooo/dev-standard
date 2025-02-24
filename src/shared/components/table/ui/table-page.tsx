import { Box, Stack, Typography } from '@mui/joy';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { TTablePagination } from '@/shared/components';
import { useToggle } from '@/shared/hooks';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TablePage({
  pagination,
  totalSize,
  totalPages,
  handlePageChange,
  handlePageSizeChange,
  tableLayoutWidth,
  tableContentsWidth,
}: {
  pagination: TTablePagination;
  totalPages: number;
  totalSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  tableLayoutWidth: string | number;
  tableContentsWidth: number;
}) {
  const [isOpenPageSizeSelectBox, togglePageSizeSelectBox] = useToggle(false);
  const [transformOrigin, setTransformOrigin] = useState<'top' | 'bottom'>('top');
  const selectBoxRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
      togglePageSizeSelectBox();
    }
  };

  useEffect(() => {
    if (isOpenPageSizeSelectBox) {
      document.addEventListener('mousedown', handleClickOutside);

      const rect = selectBoxRef.current?.getBoundingClientRect();
      if (rect) {
        const remainingSpaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = PAGE_SIZE_OPTIONS.length * 50;
        setTransformOrigin(remainingSpaceBelow >= dropdownHeight ? 'top' : 'bottom');
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenPageSizeSelectBox]);

  const getPageRange = () => {
    const current = pagination.currentPage;
    const range: (number | string)[] = [];

    if (totalPages > 10) {
      if (current < 4) {
        const prevPages = Array.from({ length: 5 }).map((_, index) => index + 1);
        range.push(...prevPages, '...', totalPages);
      } else if (current === 4) {
        const prevPages = Array.from({ length: 6 }).map((_, index) => index + 1);
        range.push(...prevPages, '...', totalPages);
      } else if (current > 4 && current <= totalPages - 4) {
        range.push(
          1,
          '...',
          ...Array.from({ length: 5 }, (_, i) => current - 2 + i),
          '...',
          totalPages,
        );
      } else if (current === totalPages - 3) {
        const lastPagesBefore6 = Array.from({ length: 6 }).map(
          (_, index) => totalPages - 4 + index,
        );
        range.push(1, '...', ...lastPagesBefore6);
      } else if (current >= totalPages - 2) {
        const lastPagesBefore5 = Array.from({ length: 5 }).map(
          (_, index) => totalPages - 4 + index,
        );
        range.push(1, '...', ...lastPagesBefore5);
      }
    } else {
      range.push(
        ...Array.from({ length: totalPages }).map((_, index) => {
          return index + 1;
        }),
      );
    }

    return range;
  };

  return (
    <Box
      className={'selection-none'}
      sx={{
        display: 'flex',
        width: tableLayoutWidth,
        minWidth: tableContentsWidth / 2,
        maxWidth:
          typeof tableLayoutWidth === 'number' && tableLayoutWidth > tableContentsWidth
            ? '100%'
            : tableContentsWidth,
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', alignSelf: 'flex-start', px: 2 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 300 }}>
          전체 <Typography sx={{ fontWeight: 700 }}>{totalSize}</Typography>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 2 }}>
          {totalPages > 10 && (
            <PageIconButton
              onClick={() => {
                if (pagination.currentPage === 1) {
                  return;
                }

                handlePageChange(1);
              }}
              disabled={pagination.currentPage === 1}
            >
              <KeyboardDoubleArrowLeftOutlinedIcon
                sx={{
                  fontSize: '1.2rem',
                  color: pagination.currentPage === 1 ? '#cccccc' : '#000000',
                  transition: 'all 0.2s',
                }}
              />
            </PageIconButton>
          )}
          <PageIconButton
            onClick={() => {
              if (pagination.currentPage === 1) {
                return;
              }

              handlePageChange(pagination.currentPage - 1);
            }}
            disabled={pagination.currentPage === 1}
          >
            <KeyboardArrowLeftOutlinedIcon
              sx={{
                fontSize: '1.2rem',
                color: pagination.currentPage === 1 ? '#cccccc' : '#000000',
                transition: 'all 0.2s',
              }}
            />
          </PageIconButton>
          {getPageRange().map((page, pageIndex) => {
            const isCurrentPage = page === pagination.currentPage;

            return (
              <Box key={pageIndex}>
                {typeof page === 'number' ? (
                  <Box
                    onClick={() => handlePageChange(page)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      backgroundColor: 'transparent',
                      border: isCurrentPage ? `1px solid ${colors.primary[400]}` : 'none',
                      borderRadius: 6,
                      '&:hover': {
                        backgroundColor: isCurrentPage ? 'none' : '#f6f6f6',
                      },
                      transition: 'all 0.1s',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: isCurrentPage ? 600 : 400,
                        color: isCurrentPage ? colors.primary[400] : '#000000',
                      }}
                    >
                      {page}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Typography sx={{ color: '#888888' }}>{page}</Typography>
                  </Box>
                )}
              </Box>
            );
          })}
          <PageIconButton
            onClick={() => {
              if (pagination.currentPage === totalPages) {
                return;
              }

              handlePageChange(pagination.currentPage + 1);
            }}
            disabled={pagination.currentPage === totalPages}
          >
            <KeyboardArrowRightOutlinedIcon
              sx={{
                fontSize: '1.2rem',
                color: pagination.currentPage === totalPages ? '#cccccc' : '#000000',
                transition: 'all 0.2s',
              }}
            />
          </PageIconButton>
          {totalPages > 10 && (
            <PageIconButton
              onClick={() => {
                if (pagination.currentPage === totalPages) {
                  return;
                }

                handlePageChange(totalPages);
              }}
              disabled={pagination.currentPage === totalPages}
            >
              <KeyboardDoubleArrowRightOutlinedIcon
                sx={{
                  fontSize: '1.2rem',
                  color: pagination.currentPage === totalPages ? '#cccccc' : '#000000',
                  transition: 'all 0.2s',
                }}
              />
            </PageIconButton>
          )}
        </Box>
        <Stack ref={selectBoxRef} sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
              minWidth: 100,
              border: '1px solid #cccccc',
              borderRadius: 6,
              pl: 1.4,
              pr: 0.4,
              height: 32,
              cursor: 'pointer',
            }}
            onClick={togglePageSizeSelectBox}
          >
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#000000' }}>
              {pagination.pageSize} / page
            </Typography>
            <ExpandMoreOutlinedIcon sx={{ fontSize: '1.4rem' }} />
          </Box>
          <AnimatePresence>
            {isOpenPageSizeSelectBox && (
              <Stack
                component={motion.div}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  duration: 0.05,
                }}
                sx={{
                  zIndex: SELECT_BOX_ITEM_Z_INDEX,
                  transformOrigin,
                  position: 'absolute',
                  top: transformOrigin === 'top' ? 36 : 'auto',
                  bottom: transformOrigin === 'bottom' ? 36 : 'auto',
                  left: 0,
                  minWidth: 100,
                  borderRadius: 6,
                  backgroundColor: '#ffffff',
                  p: 0.6,
                  boxShadow: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
                }}
              >
                {PAGE_SIZE_OPTIONS.map((pageSize) => {
                  return (
                    <Box
                      key={pageSize}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        height: 32,
                        px: 0.8,
                        cursor: 'pointer',
                        borderRadius: 6,
                        backgroundColor:
                          pageSize === pagination.pageSize ? colors.primary[50] : 'transparent',
                        '&:hover': {
                          backgroundColor: pageSize === pagination.pageSize ? 'none' : '#f4f4f4',
                        },
                        transition: 'all 0.3s',
                      }}
                      onClick={() => {
                        togglePageSizeSelectBox();
                        handlePageSizeChange(pageSize);
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: pageSize === pagination.pageSize ? 600 : 400,
                          color: '#000000',
                        }}
                      >
                        {pageSize} / page
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </AnimatePresence>
        </Stack>
      </Box>
    </Box>
  );
}

function PageIconButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        '&:hover': {
          backgroundColor: disabled ? 'none' : '#f6f6f6',
        },
        transition: 'all 0.1s',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </Box>
  );
}
