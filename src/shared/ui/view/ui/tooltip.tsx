import { CSSProperties, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { zIndex } from '@/shared/constants';
import { TooltipPosition, TooltipProps } from '../model/view-type.ts';

const tooltipPositionStyles: Record<TooltipPosition, CSSProperties> = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
  topLeft: { bottom: '100%', right: '100%' },
  topRight: { bottom: '100%', left: '100%' },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
  bottomLeft: { top: '100%', right: '100%' },
  bottomRight: { top: '100%', left: '100%' },
  left: { right: '100%', top: 0, transform: 'translateY(-50%)' },
  right: { left: '100%', top: 0, transform: 'translateY(-50%)' },
};

export function Tooltip({ style, position, children, content, disabled = false }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key='tooltip'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              ...{
                userSelect: 'none',
                position: 'absolute',
                ...tooltipPositionStyles[position],
                padding: 12,
                backgroundColor: '#414141',
                color: 'white',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                zIndex: zIndex.tooltip,
                margin: 4,
              },
              ...style,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
