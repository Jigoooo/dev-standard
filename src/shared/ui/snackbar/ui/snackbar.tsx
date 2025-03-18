import { createPortal } from 'react-dom';

import {
  Button,
  FlexColumn,
  FlexRow,
  snackbarActions,
  Typography,
  useSnackbarInfos,
} from '@/shared/ui';
import { zIndex } from '@/shared/constants';
import { SnackBarInfo } from '../model/snackbar-type.ts';
import { AnimatePresence, motion } from 'framer-motion';

export function Snackbar() {
  const snackbarInfos = useSnackbarInfos();

  return createPortal(
    <FlexColumn
      style={{
        zIndex: zIndex.snackbar,
        padding: 0,
        margin: 0,
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
    >
      <AnimatePresence>
        {snackbarInfos.map((snackbarInfo, index) => {
          return <SnackbarItem key={snackbarInfo.id} snackbarInfo={snackbarInfo} index={index} />;
        })}
      </AnimatePresence>
    </FlexColumn>,
    document.body,
  );
}

function SnackbarItem({ snackbarInfo, index }: { snackbarInfo: SnackBarInfo; index: number }) {
  const snackbarInfos = useSnackbarInfos();

  const relativeIndex = snackbarInfos.length - index - 1;
  const height = 80;

  return (
    <FlexRow
      as={motion.div}
      layout
      style={{
        position: 'absolute',
        minWidth: 350,
        maxWidth: 500,
        minHeight: height,
        maxHeight: height,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        border: `1px solid #dddddd`,
        zIndex: zIndex.snackbar + index,
        right: 0,
        bottom: 0,
      }}
      initial={{ opacity: 0.8, scale: 0.9, y: 50, rotateX: -10 }}
      animate={{
        opacity: 1,
        scale: 1 - relativeIndex * 0.05,
        y: relativeIndex * -15,
        rotateX: -relativeIndex * 5,
      }}
      exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: -10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 40 }}
    >
      <Typography>{snackbarInfo.title}</Typography>
      <Typography>{snackbarInfo.message + index}</Typography>
      <Button onClick={() => snackbarActions.hide(snackbarInfo.id)}>닫기</Button>
    </FlexRow>
  );
}
