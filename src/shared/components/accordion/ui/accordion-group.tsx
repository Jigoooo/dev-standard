import { createContext, CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { Divider, FlexColumn, FlexRow } from '@/shared/components';

const AccordionGroupContext = createContext<{
  type?: 'single' | 'multiple';
}>({});

// function useAccordionGroupContext() {
//   const context = use(AccordionGroupContext);
//   if (!context) {
//     throw new Error('Accordion must be used within a AccordionGroup');
//   }
//   return context;
// }

export function AccordionGroup({
  type = 'single',
  style,
  children,
}: {
  type?: 'single' | 'multiple';
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <AccordionGroupContext value={{ type }}>
      <FlexColumn
        style={{
          userSelect: 'none',
          gap: 16,
          ...style,
        }}
      >
        {children}
      </FlexColumn>
    </AccordionGroupContext>
  );
}

export function Accordion({
  title,
  style,
  isOpen,
  toggleAccordion,
  children,
}: {
  title?: string;
  style?: CSSProperties;
  isOpen: boolean;
  toggleAccordion: () => void;
  children: ReactNode;
}) {
  // const { type } = useAccordionGroupContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

  return (
    <FlexColumn>
      <FlexRow
        style={{
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: 16,
          ...style,
        }}
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <FlexRow
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <MdOutlineKeyboardArrowDown style={{ fontSize: '1.4rem' }} />
        </FlexRow>
      </FlexRow>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: contentHeight }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div ref={contentRef}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Divider style={{ backgroundColor: '#dddddd' }} />
    </FlexColumn>
  );
}
