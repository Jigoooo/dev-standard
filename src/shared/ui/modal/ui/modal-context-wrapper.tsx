import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

import { FlexRow, ModalContext } from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { TModalRenderProps, TModalItem, TIsPossibleOverlayClose } from '../model/modal-type.ts';

export function ModalContextWrapper({ children }: { children: ReactNode }) {
  const overlayRefs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({});

  const [modalList, setModalList] = useState<TModalItem[]>([]);
  const [isPossibleOverlayClose, setIsPossibleOverlayClose] =
    useState<TIsPossibleOverlayClose | null>(null);

  const handleIsPossibleOverlayClose = (id: string, possible: boolean) => {
    setIsPossibleOverlayClose((prevState) => {
      if (prevState) {
        return { ...prevState, [id]: possible };
      }
      return { [id]: possible };
    });
  };

  const open = (id: string, render: (props: TModalRenderProps) => ReactNode) => {
    setModalList((prev) => [...prev, { id, render }]);
  };

  const close = (id: string) => {
    setModalList((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (modalList.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalList]);

  const modalIds = modalList.map((modal) => ({ id: modal.id }));

  return createPortal(
    <ModalContext value={{ modalIds, open, close, handleIsPossibleOverlayClose }}>
      {children}
      <AnimatePresence initial={false}>
        {modalList.map((modal, index) => {
          if (!overlayRefs.current[modal.id]) {
            overlayRefs.current[modal.id] = { current: null };
          }

          return (
            <motion.div
              ref={(el) => {
                if (el) {
                  overlayRefs.current[modal.id].current = el;
                }
              }}
              key={modal.id}
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
                zIndex: zIndex.modal + index,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                overflow: 'auto',
              }}
              onClick={() => {
                if (isPossibleOverlayClose !== null && isPossibleOverlayClose[modal.id]) {
                  close(modal.id);
                }
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
                onClick={(e) => e.stopPropagation()}
              >
                {modal.render({
                  overlayRef: overlayRefs.current[modal.id],
                  isOpen: true,
                  close: () => close(modal.id),
                })}
              </FlexRow>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ModalContext>,
    document.body,
  );
}
