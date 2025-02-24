import { useRef } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { DialogTitle, Divider, ModalClose } from '@mui/joy';

import { FuturAnimatedModalProps } from '@/shared/components/modal';
import { DIALOG_Z_INDEX } from '@/shared/constants';

export function AnimatedDialogModal({
  open,
  onClose,
  keepMounted = true,
  dialogTitle,
  children,
}: Readonly<FuturAnimatedModalProps>) {
  const nodeRef = useRef(null);

  const onCloseControl = (
    _event?: object,
    reason?: 'backdropClick' | 'escapeKeyDown' | 'closeClick',
  ) => {
    if (reason && reason === 'backdropClick') return;

    if (onClose) onClose();
  };

  return (
    <Modal
      ref={nodeRef}
      keepMounted={keepMounted}
      open={open}
      onClose={onCloseControl}
      slotProps={{
        backdrop: {
          sx: {
            opacity: 0,
            backdropFilter: 'none',
            transition: `opacity 400ms, backdrop-filter 400ms`,
          },
        },
      }}
    >
      <ModalDialog
        sx={{
          zIndex: DIALOG_Z_INDEX,
          opacity: 0,
          transition: `opacity 300ms`,
        }}
        variant='outlined'
        role='alertdialog'
      >
        {dialogTitle && (
          <>
            <ModalClose variant='plain' sx={{ m: 1 }} />
            <DialogTitle>{dialogTitle}</DialogTitle>
            <Divider />
          </>
        )}
        {children}
      </ModalDialog>
    </Modal>
  );
}
