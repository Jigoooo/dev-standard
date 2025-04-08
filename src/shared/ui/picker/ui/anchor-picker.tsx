import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Placement, Strategy } from '@floating-ui/react';
import {
  flip,
  FloatingOverlay,
  FloatingPortal,
  offset,
  size,
  useClick,
  useFloating,
  useInteractions,
} from '@floating-ui/react';

import { zIndex } from '@/shared/constants';
export function AnchorPicker({
  strategy = 'absolute',
  placement = 'bottom',
  isOpen,
  setIsOpen,
  contents,
  children,
}: {
  strategy?: Strategy;
  placement?: Placement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  contents: ReactNode;
  children: ReactNode;
}) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy,
    placement,
    transform: false,
    middleware: [
      offset({
        mainAxis: 4,
      }),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
            // maxWidth: `${rects.reference.width}px`,
          });
        },
        padding: 10,
      }),
    ],
  });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <FloatingOverlay
              lockScroll
              style={{ zIndex: zIndex.anchorOverlay }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={refs.setFloating}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.14, ease: 'easeInOut' }}
              style={{
                ...{ zIndex: zIndex.anchor },
                ...floatingStyles,
              }}
              {...getFloatingProps()}
            >
              {contents}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}
