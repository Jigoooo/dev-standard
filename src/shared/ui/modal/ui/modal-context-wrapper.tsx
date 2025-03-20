import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { FlexRow, ModalContext } from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { TModalRenderProps, TModalItem, TIsPossibleOverlayClose } from '../model/modal-type.ts';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';

export function ModalContextWrapper({ children }: { children: ReactNode }) {
  const overlayRefs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({});
  const modalRef = useRef<HTMLDivElement | null>(null);

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

  const modalIds = modalList.map((modal) => ({ id: modal.id }));

  useEffect(() => {
    if (modalList.length > 0) {
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
        }
        if (event.key === 'Tab') {
          event.preventDefault();
          modalRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [modalList.length]);

  return (
    <ModalContext value={{ modalIds, open, close, handleIsPossibleOverlayClose }}>
      {children}
      <FloatingPortal>
        <div ref={modalRef} tabIndex={-1} />

        <AnimatePresence initial={false}>
          {modalList.map((modal, index) => {
            if (!overlayRefs.current[modal.id]) {
              overlayRefs.current[modal.id] = { current: null };
            }

            return (
              <div key={modal.id}>
                <FlexRow
                  as={motion.div}
                  initial={{ opacity: 0, y: '5%' }}
                  animate={{ opacity: 1, y: '0%' }}
                  exit={{ opacity: 0, y: '5%' }}
                  transition={{
                    stiffness: 300,
                    damping: 25,
                    duration: 0.1,
                  }}
                  style={{
                    position: 'fixed',
                    top: '35%',
                    left: '35%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: zIndex.modal + index,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {modal.render({
                    overlayRef: overlayRefs.current[modal.id],
                    isOpen: true,
                    close: () => close(modal.id),
                  })}
                </FlexRow>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <FloatingOverlay
                    ref={(el) => {
                      if (el) {
                        overlayRefs.current[modal.id].current = el;
                      }
                    }}
                    lockScroll
                    style={{
                      zIndex: zIndex.modalOverlay + index,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => {
                      if (isPossibleOverlayClose !== null && isPossibleOverlayClose[modal.id]) {
                        close(modal.id);
                      }
                    }}
                  />
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </FloatingPortal>
    </ModalContext>
  );
}
