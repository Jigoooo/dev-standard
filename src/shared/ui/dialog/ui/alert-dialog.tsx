import { ReactNode, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Button,
  ButtonStyle,
  dialogActions,
  DialogType,
  useDialogInfos,
  useDialogOpen,
  FlexColumn,
  FlexRow,
  Typography,
} from '@/shared/ui';
import { useModalClose } from '@/shared/hooks';
import { colors, zIndex } from '@/shared/constants';

import { DialogInfoStates } from '../model/dialog-type.ts';

/* todo 모바일버전 만들어야 함 */

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
  console.log(dialogOpen);
  useModalClose(dialogOpen, dialogActions.close);

  useEffect(() => {
    if (dialogOpen) {
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
  }, [dialogOpen]);

  return (
    <AnimatePresence>
      {dialogOpen && (
        <>
          <FlexColumn
            as={motion.div}
            initial={{ opacity: 0.6, scale: 0.94, x: '-50%', y: '-40%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0.2, scale: 0.98, x: '-50%', y: '-45%' }}
            transition={{ duration: 0.1 }}
            ref={modalRef}
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: zIndex.dialog,
              minWidth: 350,
              maxWidth: 600,
              maxHeight: 400,
              background: '#ffffff',
              paddingInline: 21,
              paddingBlock: 18,
              borderRadius: 8,
              justifyContent: 'space-between',
              outline: 'none',
            }}
          >
            <AlertDialogHeader title={dialogInfos.title} />
            <AlertDialogContents contents={dialogInfos.contents} />
            <AlertDialogActions dialogInfos={dialogInfos} />
          </FlexColumn>

          <AlertDialogOverlay overlayClose={dialogInfos.overlayClose} />
        </>
      )}
    </AnimatePresence>
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
        <FlexColumn style={{ paddingTop: 8, paddingBottom: 24, whiteSpace: 'pre-line' }}>
          <Typography style={{ fontSize: '0.9rem', fontWeight: 400, paddingRight: 12 }}>
            {contents}
          </Typography>
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
            minWidth: 80,
            color: '#bbbbbb',
            borderColor: '#bbbbbb',
          }}
          onClick={() => {
            window.history.back();
            dialogInfos?.onCancel?.();
          }}
        >
          <Typography style={{ color: '#555555', fontSize: '0.9rem', fontWeight: 500 }}>
            {dialogInfos.cancelText}
          </Typography>
        </Button>
      )}
      <Button
        style={{
          minWidth: 80,
          fontSize: '0.9rem',
          fontWeight: 500,
          backgroundColor: dialogColor,
        }}
        onClick={() => {
          window.history.back();
          setTimeout(() => dialogInfos?.onConfirm?.(), 10);
        }}
      >
        {dialogInfos.confirmText}
      </Button>
    </FlexRow>
  );
}

function AlertDialogOverlay({ overlayClose }: { overlayClose?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: zIndex.dialogOverlay,
      }}
      onClick={() => {
        if (!overlayClose) {
          return;
        }

        dialogActions.close();
        window.history.back();
      }}
    />
  );
}
