import { Toaster } from 'sonner';

import { FaCircleCheck } from 'react-icons/fa6';

import { AlertDialog } from 'shared/ui';
import { colors } from '@/shared/constants';

export function AlertProvider() {
  return (
    <>
      <AlertDialog />
      <Toaster
        icons={{
          success: <FaCircleCheck style={{ color: colors.success[400], fontSize: '1.1rem' }} />,
        }}
      />
      {/*<Snackbar />*/}
    </>
  );
}
