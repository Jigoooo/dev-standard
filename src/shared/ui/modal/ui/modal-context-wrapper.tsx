import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { FlexRow, ModalContext, TModalRenderProps } from 'shared/ui';
import { zIndex } from '@/shared/constants';

export function ModalContextWrapper({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [modalRender, setModalRender] = useState<null | ((props: TModalRenderProps) => ReactNode)>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isPossibleOverlayClose, setIsPossibleOverlayClose] = useState(false);

  const open = (render: (props: TModalRenderProps) => ReactNode) => {
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

  return (
    <ModalContext value={{ open, close, setIsPossibleOverlayClose }}>
      {children}
      <AnimatePresence initial={false}>
        {isOpen && modalRender && (
          <motion.div
            ref={overlayRef}
            key='modal-overlay'
            initial={{ opacity: 0, pointerEvents: 'none' }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: zIndex.modal,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              overflow: 'auto',
            }}
            onClick={() => {
              if (isPossibleOverlayClose) close();
            }}
          >
            <FlexRow
              as={motion.div}
              initial={{ y: '5%' }}
              animate={{ y: '0%' }}
              exit={{ y: '5%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.1,
              }}
              style={{
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
              {modalRender({ overlayRef, isOpen, close })}
            </FlexRow>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext>
  );
}
