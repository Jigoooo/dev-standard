import { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ANCHOR_OVERLAY_Z_INDEX, ANCHOR_Z_INDEX } from '@/shared/constants';

type AnchorPosition =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right';

const anchorPositionStyles: Record<AnchorPosition, CSSProperties> = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
  topLeft: { bottom: '100%', right: '100%' },
  topRight: { bottom: '100%', left: '100%' },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
  bottomLeft: { top: '100%', left: 0 },
  bottomRight: { top: '100%', right: 0 },
  left: { right: '100%', top: 0, transform: 'translateY(-50%)' },
  right: { left: '100%', top: 0, transform: 'translateY(-50%)' },
};

export function AnchorPicker({
  open,
  onClose,
  position,
  style,
  contents,
  children,
}: {
  open: boolean;
  onClose: () => void;
  position: AnchorPosition;
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
                zIndex: ANCHOR_OVERLAY_Z_INDEX,
              }}
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              style={{
                ...{
                  position: 'absolute',
                  zIndex: ANCHOR_Z_INDEX,
                },
                ...anchorPositionStyles[position],
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
