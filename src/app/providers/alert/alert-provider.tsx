import { Toaster } from 'sonner';

import { AlertDialog } from 'shared/ui';

export function AlertProvider() {
  return (
    <>
      <AlertDialog />
      <Toaster />
      {/*<Snackbar />*/}
    </>
  );
}
