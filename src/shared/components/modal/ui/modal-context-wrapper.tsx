import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from '@mui/joy';

import { ModalContext } from '@/shared/components';
import { MODAL_Z_INDEX } from '@/shared/constants';

export function ModalContextWrapper({ children }: { children: ReactNode }) {
  const [modalRender, setModalRender] = useState<
    null | ((props: { isOpen: boolean; close: () => void }) => ReactNode)
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPossibleOverlayClose, setIsPossibleOverlayClose] = useState(false);

  const open = (render: (props: { isOpen: boolean; close: () => void }) => ReactNode) => {
    setModalRender(() => render);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setModalRender(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isOpen) {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const contextValue = useMemo(() => ({ open, close, setIsPossibleOverlayClose }), []);

  return (
    <ModalContext value={contextValue}>
      {children}
      <AnimatePresence>
        {isOpen && modalRender && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: MODAL_Z_INDEX,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              overflow: 'auto',
            }}
            onClick={() => {
              if (isPossibleOverlayClose) close();
            }}
          >
            <Box
              component={motion.div}
              initial={{ y: '5%' }}
              animate={{ y: '0%' }}
              exit={{ y: '5%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.1,
              }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                minWidth: '100vw',
                minHeight: '100vh',
              }}
            >
              {modalRender({ isOpen, close })}
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </ModalContext>
  );
}
