import '@/shared/assets/css/loader.css';

import { AnimatePresence, motion } from 'framer-motion';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';

import { Typography, useLoading } from '@/shared/ui';
import { zIndex } from '@/shared/constants';

export function LoadingProvider() {
  const loadingState = useLoading();

  return (
    <FloatingPortal>
      <AnimatePresence initial={false}>
        {loadingState.isLoading && loadingState.isActiveOverlay && (
          <motion.div
            key='overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <FloatingOverlay
              lockScroll
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: zIndex.loading,
              }}
            />
          </motion.div>
        )}

        {loadingState.isLoading && (
          <motion.div
            key='loader'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'fixed',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: zIndex.loading,
            }}
          >
            <span className={'loader'} />
            <Typography style={{ fontSize: '1.2rem', color: '#f1f1f1', fontWeight: 600 }}>
              {loadingState.loadingText}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}
