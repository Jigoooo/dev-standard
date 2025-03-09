import { CSSProperties, ReactNode, RefObject } from 'react';

import CloseIcon from '@mui/icons-material/Close';

import { Button, FlexColumn, FlexRow, Divider, Typography } from '@/shared/components';
import { motion, useDragControls } from 'framer-motion';

const modalContainerDefaultStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  paddingInline: 16,
  paddingBlock: 12,
  width: 600,
  height: 300,
  borderRadius: 6,
  gap: 6,
};

export function ModalLayout({
  overlayRef,
  close,
  drag = true,
  title = '',
  containerStyle,
  children,
}: {
  overlayRef: RefObject<HTMLDivElement>;
  close: () => void;
  drag?: boolean;
  title?: string;
  containerStyle?: CSSProperties;
  children: ReactNode;
}) {
  const dragControls = useDragControls();

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
      dragConstraints={overlayRef}
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
        <Typography style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</Typography>
        <Button
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
          style={{ backgroundColor: '#ffffff', height: 36, width: 36 }}
        >
          <CloseIcon style={{ fontSize: '1.4rem', color: '#212121' }} />
        </Button>
      </FlexRow>
      <Divider />
      <FlexColumn style={{ height: '100%', overflow: 'auto' }}>{children}</FlexColumn>
    </FlexColumn>
  );
}
