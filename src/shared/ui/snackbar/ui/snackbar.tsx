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
import { useEffect, useRef, useState } from 'react';

const MAX_VISIBLE_SNACKBAR_COUNT = 3;
const SNACKBAR_HEIGHT = 80;
const SNACKBAR_WIDTH = 350;

export function Snackbar() {
  const snackbarInfos = useSnackbarInfos();
  const visibleSnackbars = snackbarInfos.slice(-MAX_VISIBLE_SNACKBAR_COUNT);

  const [isHovered, setIsHovered] = useState(false);

  return createPortal(
    <FlexColumn
      style={{
        zIndex: zIndex.snackbar,
        padding: 0,
        margin: 0,
        position: 'fixed',
        bottom: 50,
        right: 30,
        height: isHovered ? SNACKBAR_HEIGHT * MAX_VISIBLE_SNACKBAR_COUNT + 20 : SNACKBAR_HEIGHT,
        width: SNACKBAR_WIDTH,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FlexRow
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: zIndex.snackbar - 1,
          backgroundColor: 'transparent',
        }}
      />
      <AnimatePresence>
        {visibleSnackbars.map((snackbarInfo, index, array) => {
          return (
            <SnackbarItem
              key={snackbarInfo.id}
              snackbarInfo={snackbarInfo}
              index={index}
              array={array}
              isHovered={isHovered}
            />
          );
        })}
      </AnimatePresence>
    </FlexColumn>,
    document.body,
  );
}

function SnackbarItem({
  snackbarInfo,
  index,
  array,
  isHovered,
}: {
  snackbarInfo: SnackBarInfo;
  index: number;
  array: SnackBarInfo[];
  isHovered: boolean;
}) {
  const relativeIndex = array.length - index - 1;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        snackbarActions.hide(snackbarInfo.id);
      }, snackbarInfo.duration || 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovered, snackbarInfo.id, snackbarInfo.duration]);

  return (
    <FlexRow
      as={motion.div}
      layout
      style={{
        position: 'absolute',
        minWidth: SNACKBAR_WIDTH,
        maxWidth: SNACKBAR_WIDTH,
        minHeight: SNACKBAR_HEIGHT,
        maxHeight: SNACKBAR_HEIGHT,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        border: `1px solid #dddddd`,
        zIndex: zIndex.snackbar + index + 1,
        right: 0,
        bottom: 0,
      }}
      initial={{ opacity: 0.8, scale: 0.9, y: 50, rotateX: -10 }}
      animate={{
        opacity: 1,
        scale: isHovered ? 1 : 1 - relativeIndex * 0.05,
        y: isHovered ? relativeIndex * (-SNACKBAR_HEIGHT - 10) - 10 : relativeIndex * -20,
        rotateX: isHovered ? 0 : -relativeIndex * 5,
      }}
      exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: -10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 45 }}
    >
      <FlexColumn
        style={{
          justifyContent: 'center',
          width: 'calc(100% - 75px)',
          maxWidth: 'calc(100% - 75px)',
          overflow: 'hidden',
          paddingLeft: 18,
          paddingBlock: 12,
        }}
      >
        <Typography
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          {snackbarInfo.title}
        </Typography>
        {snackbarInfo.message && (
          <Typography
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '0.84rem',
              fontWeight: 400,
              color: '#999999',
            }}
          >
            {snackbarInfo.message}
          </Typography>
        )}
      </FlexColumn>
      <FlexRow
        style={{ position: 'absolute', right: 15, bottom: '50%', transform: 'translateY(50%)' }}
      >
        <Button
          onClick={() => snackbarActions.hide(snackbarInfo.id)}
          style={{ fontSize: '0.8rem', height: 24, borderRadius: 4 }}
        >
          닫기
        </Button>
      </FlexRow>
    </FlexRow>
  );
}
