import { Toaster } from 'sonner';

import { FaCircleCheck } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import { MdError } from 'react-icons/md';

import { AlertDialog } from 'shared/ui';
import { colors } from '@/shared/constants';

export function AlertProvider() {
  return (
    <>
      <AlertDialog />
      <Toaster
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #cccccc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '0.9rem',
          },
          duration: 5000,
        }}
        icons={{
          success: <FaCircleCheck style={{ color: colors.success[400], fontSize: '1.2rem' }} />,
          warning: <IoIosWarning style={{ color: colors.warning[400], fontSize: '1.2rem' }} />,
          error: <MdError style={{ color: colors.error[400], fontSize: '1.2rem' }} />,
        }}
      />
      {/*<Snackbar />*/}
    </>
  );
}
