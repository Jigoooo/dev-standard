import { ReactNode } from 'react';
import { Box, Divider, Tooltip } from '@mui/joy';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps } from '@mui/joy/styles/types';

import { MODAL_Z_INDEX } from '@/shared/constants';
import { IconButton } from '@/shared/ui';
import { useModalClose } from '@/shared/hooks/navigation/use-modal-close.ts';

type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  sx?: SxProps;
  closeIconColor?: string;
  isCloseButtonVisible?: boolean;
  children: ReactNode;
};

const modalHeaderHeight = 50;

export function TranslucentMobileModal({
  isOpen,
  onClose,
  title,
  sx,
  closeIconColor,
  isCloseButtonVisible = true,
  children,
}: ModalType) {
  useModalClose(isOpen, onClose);

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
              top: 0,
              left: 0,
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
          >
            <Box
              sx={[
                {
                  pb: 3,
                  width: '100%',
                  height: '100%',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
              ]}
            >
              <ModalHeader
                title={title}
                onClose={onClose}
                closeIconColor={closeIconColor}
                isCloseButtonVisible={isCloseButtonVisible}
              />
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({
  title,
  onClose,
  closeIconColor = '#ffffff',
  isCloseButtonVisible,
}: {
  title: ReactNode;
  onClose: () => void;
  closeIconColor?: string;
  isCloseButtonVisible?: boolean;
}) {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: modalHeaderHeight,
      }}
    >
      {title && title !== '' ? title : <Box />}
      {isCloseButtonVisible && (
        <Tooltip title={'닫기'} placement={'top'}>
          <IconButton
            onClick={() => {
              onClose();
              window.history.back();
            }}
            color={'neutral'}
          >
            <CloseIcon style={{ color: closeIconColor, fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
