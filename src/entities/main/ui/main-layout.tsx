import { CSSProperties, ReactNode } from 'react';

import { MainHeader } from './main-header.tsx';
import { FlexColumn } from '@/shared/components';
import { useMenuState } from '@/entities/menu';

export function MainLayout({
  layoutStyle,
  headerTitle,
  children,
}: {
  layoutStyle?: CSSProperties;
  headerTitle?: string;
  children: ReactNode;
}) {
  const menuState = useMenuState();

  return (
    <FlexColumn
      style={{
        ...{
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: `calc(100vw - ${menuState.sidebarWidth}px)`,
          maxHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          paddingInline: 16,
          paddingBlock: 16,
        },
        ...layoutStyle,
      }}
    >
      <MainHeader title={headerTitle ?? menuState.selectedMenu.name} />
      {children}
    </FlexColumn>
  );
}
