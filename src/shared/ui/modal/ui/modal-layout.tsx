import type { CSSProperties, ReactNode, RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

import { LuX } from 'react-icons/lu';

import { Button, FlexColumn, FlexRow, Typography } from '@/shared/ui';

const modalContainerDefaultStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
  width: '37.5rem',
  height: '18.75rem',
  borderRadius: '0.375rem',
  gap: '0.375rem',
};

export function ModalLayout({
  overlayRef,
  close,
  drag = true,
  title = '',
  containerStyle,
  children,
}: {
  overlayRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  drag?: boolean;
  title?: string;
  containerStyle?: CSSProperties;
  withHeader?: boolean;
  children: ReactNode;
}) {
  const dragControls = useDragControls();

  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  });

  useLayoutEffect(() => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();

      setConstraints({
        top: rect.top - rect.bottom / 4 - 20,
        left: rect.left - rect.right / 4 + 20,
        right: rect.right / 4 - 20,
        bottom: rect.bottom / 4 + 20,
      });
    }
  }, [overlayRef.current]);

  return (
    <FlexColumn
      as={motion.div}
      style={{
        ...modalContainerDefaultStyle,
        ...containerStyle,
      }}
      drag={drag}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={constraints}
      dragMomentum={false}
      dragElastic={0}
    >
      <FlexRow
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
        }}
        as={motion.div}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <Typography style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</Typography>
        <Button
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
          style={{ backgroundColor: '#ffffff', width: '2rem' }}
          transition={{ duration: 0.1 }}
        >
          <LuX style={{ fontSize: '1.4rem', color: '#212121' }} />
        </Button>
      </FlexRow>
      {/*<Divider />*/}
      <FlexColumn style={{ flexGrow: 1, overflow: 'auto' }}>{children}</FlexColumn>
    </FlexColumn>
  );
}
