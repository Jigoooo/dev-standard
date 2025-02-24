import { MouseEvent, ReactNode } from 'react';
import { Box, Divider, Typography, IconButton, Tooltip } from '@mui/joy';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
// import { Resizable } from 're-resizable';

import { MODAL_Z_INDEX } from '@/shared/constants';
import { useDraggable } from '@/shared/hooks/common/use-draggable.ts';

type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  defaultSize?: {
    width?: number | string;
    height?: number | string;
  };
  minSize?: {
    width?: number | string;
    height?: number | string;
  };
  maxSize?: {
    width?: number | string;
    height?: number | string;
  };
  children: ReactNode;
};

const modalHeaderHeight = 80;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  // defaultSize = { width: 500, height: 300 },
  // minSize = { width: 300, height: 200 },
  // maxSize = { width: undefined, height: undefined },
}: ModalType) {
  const { position, elementRef, handleMouseDown } = useDraggable();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: MODAL_Z_INDEX - 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'fixed',
              top: position?.y ?? 0,
              left: position?.x ?? 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: MODAL_Z_INDEX,
            }}
            initial={{ opacity: 0.5, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            ref={elementRef}
          >
            {/*<Resizable*/}
            {/*  defaultSize={defaultSize}*/}
            {/*  minWidth={minSize.width}*/}
            {/*  minHeight={minSize.height}*/}
            {/*  maxWidth={maxSize.width}*/}
            {/*  maxHeight={maxSize.height}*/}
            {/*  style={{*/}
            {/*    backgroundColor: 'white',*/}
            {/*    borderRadius: '8px',*/}
            {/*    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',*/}
            {/*    position: 'relative',*/}
            {/*  }}*/}
            {/*>*/}
            <Box
              sx={{
                px: 3,
                pb: 3,
                height: '100%',
              }}
            >
              <ModalHeader title={title} onClose={onClose} onMouseDown={handleMouseDown} />
              <Divider />
              <Box
                sx={{
                  overflow: 'auto',
                  height: `calc(100% - ${modalHeaderHeight}px)`,
                }}
              >
                {children}
              </Box>
            </Box>
            {/*</Resizable>*/}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({
  title,
  onClose,
  onMouseDown,
}: {
  title: string;
  onClose: () => void;
  onMouseDown: (event: MouseEvent) => void;
}) {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        pt: 3,
        pb: 1.4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: modalHeaderHeight,
      }}
      onMouseDown={onMouseDown}
    >
      <Typography sx={{ fontSize: '1.6rem', fontWeight: 700 }}>{title}</Typography>
      <Tooltip title={'닫기'} placement={'top'}>
        <IconButton onClick={onClose} color={'neutral'}>
          <CloseIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
