import { ReactNode, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';

import { FlexRow, ModalContext } from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { TModalRenderProps, TModalItem, TIsPossibleOverlayClose } from '../model/modal-type.ts';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { useModalController } from '@/shared/hooks';

/* todo 모바일버전 만들어야 함 */

export function ModalContextWrapper({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
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
    setModalList((prevState) => [...prevState, { id, render, order: prevState.length }]);
  };

  const close = (id: string) => {
    setModalList((prev) => prev.filter((item) => item.id !== id));
  };

  const modalIds = modalList.map((modal) => ({ id: modal.id }));

  useModalController({
    modalRef,
    isOpen: modalList.length > 0,
    onClose: () => {
      if (modalList.length > 0) {
        const findLastOrderModal = modalList.find((modal) => modal.order === modalList.length - 1);

        if (findLastOrderModal) {
          close(findLastOrderModal.id);
        }
      }
    },
  });

  return (
    <ModalContext value={{ modalIds, open, close, handleIsPossibleOverlayClose }}>
      {children}

      <FloatingPortal>
        <div ref={modalRef} tabIndex={-1} />
        {modalList.length > 0 && (
          <div
            ref={overlayRef}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        )}

        <AnimatePresence initial={false}>
          {modalList.map((modal, index) => {
            return (
              <div key={modal.id} style={{ userSelect: 'none' }}>
                <FlexRow
                  as={motion.div}
                  initial={{ opacity: 0, x: '-50%', y: '-45%' }}
                  animate={{ opacity: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, x: '-50%', y: '-45%' }}
                  transition={{
                    duration: 0.1,
                  }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: zIndex.modal + index,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {modal.render({
                    overlayRef: overlayRef,
                    isOpen: true,
                    close: () => {
                      close(modal.id);

                      if (isMobile) {
                        window.history.back();
                      }
                    },
                  })}
                </FlexRow>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <FloatingOverlay
                    lockScroll
                    style={{
                      zIndex: zIndex.modalOverlay + index,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => {
                      if (isPossibleOverlayClose !== null && isPossibleOverlayClose[modal.id]) {
                        close(modal.id);

                        if (isMobile) {
                          window.history.back();
                        }
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
