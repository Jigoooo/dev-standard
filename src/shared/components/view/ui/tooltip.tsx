import { ReactNode, CSSProperties, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TOOLTIP_Z_INDEX } from '@/shared/constants';

type TooltipPosition =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right';

type TooltipProps = {
  position: TooltipPosition;
  children: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

const tooltipPositionStyles: Record<TooltipPosition, CSSProperties> = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
  topLeft: { bottom: '100%', left: 0 },
  topRight: { bottom: '100%', right: 0 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
  bottomLeft: { top: '100%', left: 0 },
  bottomRight: { top: '100%', right: 0 },
  left: { right: '100%', top: '50%', transform: 'translateY(-50%)' },
  right: { left: '100%', top: '50%', transform: 'translateY(-50%)' },
};

export function Tooltip({ position, children, content, disabled = false }: TooltipProps) {
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
              position: 'absolute',
              ...tooltipPositionStyles[position],
              padding: 8,
              backgroundColor: '#414141',
              color: 'white',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              zIndex: TOOLTIP_Z_INDEX,
              margin: 4,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
