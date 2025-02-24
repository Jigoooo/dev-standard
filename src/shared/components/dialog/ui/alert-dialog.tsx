import { Box, Stack, Typography } from '@mui/joy';

import { closeDialog, useDialogInfos, useDialogOpen } from '@/shared/components';
import { OutlinedButton, SolidButton } from '@/shared/ui';
import { useModalClose } from '@/shared/hooks/navigation/use-modal-close.ts';

/* todo 모바일버전 만들어야 함 */

export function AlertDialog() {
  const dialogOpen = useDialogOpen();
  const dialogInfos = useDialogInfos();

  useModalClose(dialogOpen, closeDialog);

  return (
    <>
      {dialogOpen && (
        <>
          <Stack
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              minWidth: 350,
              maxWidth: 600,
              maxHeight: 400,
              background: '#ffffff',
              px: 2.6,
              py: 2.2,
              borderRadius: 8,
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, whiteSpace: 'pre-line' }}>
                {dialogInfos.title}
              </Typography>
            </Box>
            {!!dialogInfos.contents ? (
              <Stack sx={{ pt: 1, pb: 3, whiteSpace: 'pre-line' }}>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 500, pr: 1.4 }}>
                  {dialogInfos.contents}
                </Typography>
              </Stack>
            ) : (
              <Box sx={{ height: 20 }}></Box>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {dialogInfos.withCancel && (
                <OutlinedButton
                  sx={{
                    height: 35,
                    minWidth: 80,
                    color: '#000000',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                  buttonColor={'#bbbbbb'}
                  onClick={() => {
                    window.history.back();
                    dialogInfos?.onCancel?.();
                  }}
                >
                  {dialogInfos.cancelText}
                </OutlinedButton>
              )}
              <SolidButton
                sx={{ height: 35, minWidth: 80, fontSize: '0.9rem', fontWeight: 500 }}
                onClick={() => {
                  window.history.back();
                  setTimeout(() => dialogInfos?.onConfirm?.(), 10);
                }}
                color={dialogInfos.color}
              >
                {dialogInfos.confirmText}
              </SolidButton>
            </Box>
          </Stack>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99,
            }}
            onClick={() => {
              closeDialog();
              window.history.back();
            }}
          />
        </>
      )}
    </>
  );
}
