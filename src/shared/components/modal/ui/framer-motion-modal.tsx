import { motion, AnimatePresence } from 'framer-motion';
import { Stack } from '@mui/joy';

import { DIALOG_OVERLAY_Z_INDEX, DIALOG_Z_INDEX } from '@/shared/constants';
import { detectDeviceTypeAndOS } from '@/shared/lib';

interface FtFramerMotionModalProps {
  open: boolean;
  closedModal: () => void;
}

const modalVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: '-50%' },
};

const spring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export function FramerMotionModal({ open, closedModal }: FtFramerMotionModalProps) {
  const { isMobile } = detectDeviceTypeAndOS();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            style={{
              background: '#aaaaaa2e',
              width: '100%',
              height: '100%',
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: DIALOG_OVERLAY_Z_INDEX,
            }}
          />
          <motion.div
            style={{
              position: 'fixed',
              display: 'flex',
              width: 'auto',
              height: 'auto',
              top: '35%',
              left: isMobile ? '30%' : '50%',
              transform: 'translate3d(-50%, 0, 0)',
              zIndex: DIALOG_Z_INDEX,
              backgroundColor: 'black',
            }}
            initial={{ y: 10, x: '-50%', opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            variants={modalVariants}
            layout
            transition={spring}
          >
            <Stack sx={{ p: 2 }}>
              <h2>Modal Title</h2>
              <p>Modal Content</p>
              <button onClick={closedModal}>Close Modal</button>
            </Stack>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
