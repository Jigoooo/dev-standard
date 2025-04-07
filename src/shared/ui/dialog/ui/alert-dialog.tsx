import { ReactNode, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';

import {
  Button,
  ButtonStyle,
  dialog,
  DialogType,
  useDialogInfos,
  useDialogOpen,
  FlexColumn,
  FlexRow,
  Typography,
  useModalController,
} from '@/shared/ui';
import { colors, zIndex } from '@/shared/constants';
import { DialogInfoStates } from '../model/dialog-type.ts';

const dialogColors: Record<DialogType, string> = {
  [DialogType.INFO]: colors.primary[400],
  [DialogType.SUCCESS]: colors.success[400],
  [DialogType.WARNING]: colors.warning[500],
  [DialogType.ERROR]: colors.error[400],
} as const;

export function AlertDialog() {
  const dialogOpen = useDialogOpen();
  const dialogInfos = useDialogInfos();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useModalController({
    modalRef,
    isOpen: dialogOpen,
    onClose: dialog.close,
  });

  return (
    <FloatingPortal>
      <div ref={modalRef} tabIndex={-1} />

      <AnimatePresence initial={false}>
        {dialogOpen && (
          <>
            <FlexColumn
              as={motion.div}
              initial={{ opacity: 0.6, scale: 0.94, x: '-50%', y: '-40%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0.2, scale: 0.98, x: '-50%', y: '-45%' }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                zIndex: zIndex.dialog,
                minWidth: '21.875rem',
                maxWidth: '37.5rem',
                maxHeight: '25rem',
                background: '#ffffff',
                paddingInline: '1.32rem',
                paddingBlock: '1.125rem',
                borderRadius: '0.5rem',
                justifyContent: 'space-between',
                outline: 'none',
                userSelect: 'none',
              }}
            >
              <AlertDialogHeader title={dialogInfos.title} />
              <AlertDialogContents contents={dialogInfos.contents} />
              <AlertDialogActions dialogInfos={dialogInfos} />
            </FlexColumn>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.01 }}
            >
              <FloatingOverlay
                lockScroll
                style={{ zIndex: zIndex.dialogOverlay, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => {
                  dialog.close();

                  if (isMobile) {
                    window.history.back();
                  }
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}

function AlertDialogHeader({ title }: { title?: string }) {
  return (
    <FlexRow
      style={{
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Typography style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'pre-line' }}>
        {title}
      </Typography>
    </FlexRow>
  );
}

function AlertDialogContents({ contents }: { contents?: ReactNode }) {
  return (
    <>
      {contents ? (
        <FlexColumn
          style={{
            paddingTop: 8,
            paddingBottom: 24,
            whiteSpace: 'pre-line',
            overflowY: 'auto',
            marginBottom: 10,
          }}
        >
          {typeof contents === 'string' ? (
            <Typography style={{ fontSize: '0.9rem', fontWeight: 400, paddingRight: 12 }}>
              {contents}
            </Typography>
          ) : (
            contents
          )}
        </FlexColumn>
      ) : (
        <div style={{ height: 10 }}></div>
      )}
    </>
  );
}

function AlertDialogActions({ dialogInfos }: { dialogInfos: DialogInfoStates }) {
  const dialogColor = dialogColors[dialogInfos.dialogType as DialogType];

  return (
    <FlexRow
      style={{
        gap: 8,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {dialogInfos.withCancel && (
        <Button
          buttonStyle={ButtonStyle.OUTLINED}
          style={{
            minWidth: '5rem',
            color: '#bbbbbb',
            borderColor: '#bbbbbb',
          }}
          onClick={() => {
            dialogInfos?.onCancel?.();

            if (isMobile) {
              window.history.back();
            }
          }}
        >
          <Typography style={{ color: '#555555', fontSize: '0.9rem', fontWeight: 500 }}>
            {dialogInfos.cancelText}
          </Typography>
        </Button>
      )}
      <Button
        style={{
          minWidth: '5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          backgroundColor: dialogColor,
        }}
        onClick={() => {
          if (isMobile) {
            window.history.back();
          }

          setTimeout(() => dialogInfos?.onConfirm?.(), 10);
        }}
      >
        {dialogInfos.confirmText}
      </Button>
    </FlexRow>
  );
}
