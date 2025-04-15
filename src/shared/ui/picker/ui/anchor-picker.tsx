import { type MouseEvent, useEffect, useRef, type ReactNode } from 'react';
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
  minAxisOffset = 8,
  crossAxis = 0,
  isOpen,
  setIsOpen,
  onOverlayClick,
  onClose,
  contents,
  cachedChildren = false,
  useAnimation = true,
  children,
}: {
  strategy?: Strategy;
  placement?: Placement;
  minAxisOffset?: number;
  crossAxis?: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOverlayClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onClose?: () => void;
  contents: ReactNode;
  cachedChildren?: boolean;
  useAnimation?: boolean;
  children: ReactNode;
}) {
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      onClose?.();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, onClose]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy,
    placement,
    transform: false,
    middleware: [
      offset({ mainAxis: minAxisOffset, crossAxis }),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  const floatingContent = (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: zIndex.anchor,
        ...(cachedChildren && !useAnimation
          ? {
              visibility: isOpen ? 'visible' : 'hidden',
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: 'opacity 0.1s ease-in-out',
            }
          : {}),
      }}
      {...getFloatingProps()}
    >
      {contents}
    </div>
  );

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      {cachedChildren ? (
        <FloatingPortal>
          {isOpen && (
            <FloatingOverlay
              lockScroll
              style={{ zIndex: zIndex.anchorOverlay }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onOverlayClick?.(e);
              }}
            />
          )}
          {useAnimation ? (
            <motion.div
              ref={refs.setFloating}
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              style={{
                ...floatingStyles,
                zIndex: zIndex.anchor,
                visibility: isOpen ? 'visible' : 'hidden',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
              {...getFloatingProps()}
            >
              {contents}
            </motion.div>
          ) : (
            floatingContent
          )}
        </FloatingPortal>
      ) : useAnimation ? (
        <AnimatePresence>
          {isOpen && (
            <FloatingPortal>
              <FloatingOverlay
                lockScroll
                style={{ zIndex: zIndex.anchorOverlay }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onOverlayClick?.(e);
                }}
              />
              <motion.div
                ref={refs.setFloating}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
                style={{
                  ...floatingStyles,
                  zIndex: zIndex.anchor,
                }}
                {...getFloatingProps()}
              >
                {contents}
              </motion.div>
            </FloatingPortal>
          )}
        </AnimatePresence>
      ) : (
        isOpen && (
          <FloatingPortal>
            <FloatingOverlay
              lockScroll
              style={{ zIndex: zIndex.anchorOverlay }}
              onClick={() => setIsOpen(false)}
            />
            {floatingContent}
          </FloatingPortal>
        )
      )}
    </>
  );
}
