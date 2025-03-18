import { createPortal } from 'react-dom';

import { FlexColumn, FlexRow, Typography, useSnackbarInfos } from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { SnackBarInfo } from '../model/snackbar-type.ts';
import { AnimatePresence, motion } from 'framer-motion';

export function Snackbar() {
  const snackbarInfos = useSnackbarInfos();

  return createPortal(
    <FlexRow>
      <FlexColumn
        style={{
          zIndex: zIndex.snackbar,
          pointerEvents: 'none',
          padding: 0,
          margin: 0,
          position: 'fixed',
          display: 'flex',
          bottom: 0,
          right: 0,
          top: 0,
          flexDirection: 'column',
          listStyle: 'none',
          justifyContent: 'flex-end',
          height: 'auto',
        }}
      >
        <AnimatePresence>
          {snackbarInfos.map((snackbarInfo, index) => {
            return <SnackbarItem key={snackbarInfo.id} snackbarInfo={snackbarInfo} index={index} />;
          })}
        </AnimatePresence>
      </FlexColumn>
    </FlexRow>,
    document.body,
  );
}

function SnackbarItem({ snackbarInfo, index }: { snackbarInfo: SnackBarInfo; index: number }) {
  return (
    <FlexRow
      as={motion.div}
      layout
      style={{
        minWidth: 200,
        maxWidth: 500,
        minHeight: 100,
        maxHeight: 300,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        marginBottom: -30,
        zIndex: 100 + index,
      }}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
      <Typography>{snackbarInfo.title}</Typography>
      <Typography>{snackbarInfo.message}</Typography>
    </FlexRow>
  );
}
