import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import { colors, zIndex } from '@/shared/constants';
import { FlexColumn, FlexRow, TTablePagination, Typography } from '@/shared/ui';
import { useToggle } from '@/shared/hooks';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TablePageLegacy({
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
    <FlexRow
      className={'selection-none'}
      style={{
        width: tableLayoutWidth,
        minWidth: tableContentsWidth / 2,
        maxWidth:
          typeof tableLayoutWidth === 'number' && tableLayoutWidth > tableContentsWidth
            ? '100%'
            : tableContentsWidth,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBlock: 16,
      }}
    >
      <FlexRow style={{ alignItems: 'flex-start', alignSelf: 'flex-start', paddingInline: 16 }}>
        <Typography style={{ fontSize: '0.9rem', fontWeight: 300 }}>
          전체 <Typography style={{ fontWeight: 700 }}>{totalSize}</Typography>
        </Typography>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center', gap: 6 }}>
        <FlexRow style={{ alignItems: 'center', gap: 6, paddingInline: 16 }}>
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
              <div key={pageIndex}>
                {typeof page === 'number' ? (
                  <FlexRow
                    as={motion.div}
                    onClick={() => handlePageChange(page)}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      backgroundColor: 'transparent',
                      border: isCurrentPage ? `1px solid ${colors.primary[400]}` : 'none',
                      borderRadius: 6,
                      transition: 'all 0.1s',
                      cursor: 'pointer',
                    }}
                    variants={{
                      hover: {
                        backgroundColor: '#f6f6f6',
                      },
                      none: {},
                    }}
                    whileHover={isCurrentPage ? 'none' : 'hover'}
                  >
                    <Typography
                      style={{
                        fontWeight: isCurrentPage ? 600 : 400,
                        color: isCurrentPage ? colors.primary[400] : '#000000',
                      }}
                    >
                      {page}
                    </Typography>
                  </FlexRow>
                ) : (
                  <FlexRow
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Typography style={{ color: '#888888' }}>{page}</Typography>
                  </FlexRow>
                )}
              </div>
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
        </FlexRow>
        <FlexColumn ref={selectBoxRef} style={{ position: 'relative' }}>
          <FlexRow
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 6,
              minWidth: 100,
              border: '1px solid #cccccc',
              borderRadius: 6,
              paddingLeft: 10,
              paddingRight: 4,
              height: 32,
              cursor: 'pointer',
            }}
            onClick={togglePageSizeSelectBox}
          >
            <Typography style={{ fontSize: '0.9rem', fontWeight: 600, color: '#000000' }}>
              {pagination.pageSize} / page
            </Typography>
            <ExpandMoreOutlinedIcon sx={{ fontSize: '1.4rem' }} />
          </FlexRow>
          <AnimatePresence>
            {isOpenPageSizeSelectBox && (
              <FlexColumn
                as={motion.div}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  duration: 0.05,
                }}
                style={{
                  zIndex: zIndex.selectBoxItem,
                  transformOrigin,
                  position: 'absolute',
                  top: transformOrigin === 'top' ? 36 : 'auto',
                  bottom: transformOrigin === 'bottom' ? 36 : 'auto',
                  left: 0,
                  minWidth: 100,
                  borderRadius: 6,
                  backgroundColor: '#ffffff',
                  padding: 6,
                  boxShadow: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
                }}
              >
                {PAGE_SIZE_OPTIONS.map((pageSize) => {
                  return (
                    <FlexRow
                      key={pageSize}
                      as={motion.div}
                      style={{
                        alignItems: 'center',
                        gap: 6,
                        height: 32,
                        paddingInline: 6,
                        cursor: 'pointer',
                        borderRadius: 6,
                        backgroundColor:
                          pageSize === pagination.pageSize
                            ? colors.primary[50]
                            : 'rgba(244, 244, 244, 0)',
                        transition: 'all 0.3s',
                      }}
                      variants={{
                        hover: {
                          backgroundColor: '#f4f4f4',
                        },
                        none: {},
                      }}
                      whileHover={pageSize === pagination.pageSize ? 'none' : 'hover'}
                      onClick={() => {
                        togglePageSizeSelectBox();
                        handlePageSizeChange(pageSize);
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: pageSize === pagination.pageSize ? 600 : 400,
                          color: '#000000',
                        }}
                      >
                        {pageSize} / page
                      </Typography>
                    </FlexRow>
                  );
                })}
              </FlexColumn>
            )}
          </AnimatePresence>
        </FlexColumn>
      </FlexRow>
    </FlexRow>
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
    <FlexRow
      as={motion.div}
      onClick={onClick}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        transition: 'all 0.1s',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      variants={{
        hover: {
          backgroundColor: '#f6f6f6',
        },
        none: {},
      }}
      whileHover={disabled ? 'none' : 'hover'}
    >
      {children}
    </FlexRow>
  );
}
