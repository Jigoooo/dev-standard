import { CSSProperties, ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';

import { Button, FlexColumn, FlexRow, Divider } from '@/shared/components';

const modalContainerDefaultStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: 16,
  width: 600,
  height: 300,
  borderRadius: 6,
  gap: 8,
};

export function ModalLayout({
  close,
  title = '',
  containerStyle,
  children,
}: {
  close: () => void;
  title?: string;
  containerStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <FlexColumn
      style={{
        ...modalContainerDefaultStyle,
        ...containerStyle,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</span>
        <Button onClick={close} style={{ backgroundColor: '#ffffff', height: 36, width: 36 }}>
          <CloseIcon style={{ fontSize: '1.4rem', color: '#212121' }} />
        </Button>
      </FlexRow>
      <Divider />
      <FlexColumn style={{ overflow: 'auto' }}>{children}</FlexColumn>
    </FlexColumn>
  );
}
