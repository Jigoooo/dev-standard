import { ReactNode } from 'react';
import { Box } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { AnimatePresence, motion } from 'framer-motion';

export function AnchorPicker({
  open,
  onClose,
  sx,
  contents,
  children,
}: {
  open: boolean;
  onClose: () => void;
  sx?: SxProps;
  contents: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
      <AnimatePresence>
        {open && (
          <>
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 999,
              }}
              onTap={onClose}
            />
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                transformOrigin: 'top left',
              }}
            >
              {contents}
            </Box>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}
