import { MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
// import { Resizable } from 're-resizable';

import { zIndex } from '@/shared/constants';
import { useDraggable } from '@/shared/hooks/common/use-draggable.ts';
import { Button, FlexRow, Tooltip, Typography } from 'shared/ui';

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

export function MobileModal({
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
              zIndex: zIndex.modal - 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
          <FlexRow
            as={motion.div}
            style={{
              position: 'fixed',
              top: position?.y ?? 0,
              left: position?.x ?? 0,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: zIndex.modal,
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
            <div
              style={{
                paddingInline: 24,
                paddingBottom: 24,
                height: '100%',
              }}
            >
              <ModalHeader title={title} onClose={onClose} onMouseDown={handleMouseDown} />
              <div style={{ height: 1, width: '100%', backgroundColor: '#e0e0e0' }}></div>
              <div
                style={{
                  overflow: 'auto',
                  height: `calc(100% - ${modalHeaderHeight}px)`,
                }}
              >
                {children}
              </div>
            </div>
            {/*</Resizable>*/}
          </FlexRow>
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
    <FlexRow
      style={{
        cursor: 'pointer',
        paddingTop: 24,
        paddingBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: modalHeaderHeight,
      }}
      onMouseDown={onMouseDown}
    >
      <Typography style={{ fontSize: '1.6rem', fontWeight: 700 }}>{title}</Typography>
      <Tooltip content={'닫기'} position={'top'}>
        <Button onClick={onClose} style={{ backgroundColor: '#ffffff' }}>
          <CloseIcon style={{ fontSize: 32 }} />
        </Button>
      </Tooltip>
    </FlexRow>
  );
}
