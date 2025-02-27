import { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function AnchorPicker({
  open,
  onClose,
  style,
  contents,
  children,
}: {
  open: boolean;
  onClose: () => void;
  style?: CSSProperties;
  contents: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ ...{ position: 'relative' }, ...style }}>
      {children}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 999,
              }}
              onTap={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                transformOrigin: 'top left',
              }}
            >
              {contents}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
