import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { offset, useFloating, useHover, useInteractions } from '@floating-ui/react';

import { zIndex } from '@/shared/constants';
import { TooltipProps } from '../model/view-type.ts';

export function Tooltip({ style, placement, children, content, disabled = false }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setIsOpen,
    transform: false,
    middleware: [
      // arrow({
      //   element: arrowRef,
      // }),
      offset({
        mainAxis: placement.includes('top') || placement.includes('bottom') ? 10 : 6,
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20, duration: 0.04 }}
            style={{
              ...{
                userSelect: 'none',
                paddingInline: 14,
                paddingBlock: 4,
                backgroundColor: '#414141',
                color: 'white',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                zIndex: zIndex.tooltip,
                margin: 4,
                fontSize: '0.82rem',
              },
              ...style,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {/*<FloatingArrow*/}
            {/*  ref={arrowRef}*/}
            {/*  context={context}*/}
            {/*  width={10}*/}
            {/*  height={8}*/}
            {/*  tipRadius={2}*/}
            {/*  fill={'#414141'}*/}
            {/*  stroke={'#414141'}*/}
            {/*/>*/}
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
