import type { CSSProperties, ReactNode, RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

import { LuX } from 'react-icons/lu';

import { FlexColumn, FlexRow, Typography } from '@/shared/ui';

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
  subTitle = '',
  containerStyle,
  children,
}: {
  overlayRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  drag?: boolean;
  title?: string;
  subTitle?: string;
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
        <FlexColumn style={{ gap: '0.2rem' }}>
          <Typography style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</Typography>
          <Typography style={{ fontSize: '0.9rem', color: '#888888' }}>{subTitle}</Typography>
        </FlexColumn>
        <FlexColumn style={{ height: '100%', justifyContent: 'flex-start' }}>
          <FlexRow
            as={motion.div}
            style={{
              width: '1.8rem',
              height: '1.8rem',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
            whileTap={{ border: '0.1rem solid #aaaaaa' }}
            transition={{ duration: 0.04 }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              close();
            }}
          >
            <LuX style={{ fontSize: '1.3rem', color: '#212121' }} />
          </FlexRow>
        </FlexColumn>
      </FlexRow>
      {/*<Divider />*/}
      <FlexColumn style={{ flexGrow: 1, overflow: 'auto' }}>{children}</FlexColumn>
    </FlexColumn>
  );
}
