import {
  Button,
  ButtonStyle,
  dialogActions,
  DialogType,
  useDialogInfos,
  useDialogOpen,
  FlexColumn,
  FlexRow,
} from '@/shared/components';
import { useModalClose } from '@/shared/hooks';
import { colors } from '@/shared/constants';
import { useEffect, useRef } from 'react';

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

  useModalClose(dialogOpen, dialogActions.closeDialog);
  const dialogColor = dialogColors[dialogInfos.dialogType as DialogType];

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
    <>
      {dialogOpen && (
        <>
          <FlexColumn
            ref={modalRef}
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
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
            <FlexRow
              style={{
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1.3rem', fontWeight: 700, whiteSpace: 'pre-line' }}>
                {dialogInfos.title}
              </span>
            </FlexRow>
            {!!dialogInfos.contents ? (
              <FlexColumn style={{ paddingTop: 8, paddingBottom: 24, whiteSpace: 'pre-line' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, paddingRight: 12 }}>
                  {dialogInfos.contents}
                </span>
              </FlexColumn>
            ) : (
              <div style={{ height: 20 }}></div>
            )}
            <FlexRow
              style={{
                gap: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {dialogInfos.withCancel && (
                <Button
                  buttonStyle={ButtonStyle.OUTLINED}
                  style={{
                    height: 35,
                    minWidth: 80,
                    color: '#bbbbbb',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    window.history.back();
                    dialogInfos?.onCancel?.();
                  }}
                >
                  {dialogInfos.cancelText}
                </Button>
              )}
              <Button
                style={{
                  height: 35,
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
          </FlexColumn>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99,
            }}
            onClick={() => {
              dialogActions.closeDialog();
              window.history.back();
            }}
          />
        </>
      )}
    </>
  );
}
