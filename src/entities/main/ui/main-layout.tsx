import { CSSProperties, ReactNode } from 'react';

import { MainHeader } from './main-header.tsx';
import { FlexColumn } from '@/shared/components';

export function MainLayout({
  layoutStyle,
  headerTitle,
  children,
}: {
  layoutStyle?: CSSProperties;
  headerTitle: string;
  children: ReactNode;
}) {
  return (
    <FlexColumn
      style={{
        ...{
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          height: '100%',
          px: 2,
          py: 1,
          overflowX: 'auto',
        },
        ...layoutStyle,
      }}
    >
      <MainHeader title={headerTitle} />
      {children}
    </FlexColumn>
  );
}
