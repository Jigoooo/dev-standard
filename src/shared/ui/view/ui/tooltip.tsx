import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  arrow,
  FloatingArrow,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';

import { zIndex } from '@/shared/constants';
import { TooltipProps } from '../model/view-type.ts';

export function Tooltip({ style, placement, children, content, disabled = false }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setIsOpen,
    transform: false,
    middleware: [
      arrow({
        element: arrowRef,
      }),
      offset({
        mainAxis: placement.includes('top') || placement.includes('bottom') ? 14 : 6,
        crossAxis: -3,
      }),
    ],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            key='tooltip'
            ref={refs.setFloating}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              ...{
                userSelect: 'none',
                padding: 8,
                backgroundColor: '#414141',
                color: 'white',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                zIndex: zIndex.tooltip,
                margin: 4,
              },
              ...style,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              width={10}
              height={8}
              tipRadius={2}
              fill={'#414141'}
              stroke={'#414141'}
            />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
