import { CSSProperties, ReactNode } from 'react';

import { MainHeader } from './main-header.tsx';
import { FlexColumn } from '@/shared/components';
import { useRouterMenuContext, useRouterState } from '@/entities/router';
import { useLocation } from 'react-router-dom';

export function MainLayout({
  layoutStyle,
  headerTitle,
  children,
}: {
  layoutStyle?: CSSProperties;
  headerTitle?: string;
  children: ReactNode;
}) {
  const location = useLocation();
  const routerState = useRouterState();
  const { findCurrentMenu } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);

  return (
    <FlexColumn
      style={{
        ...{
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: `calc(100vw - ${routerState.sidebarWidth}px)`,
          maxHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          paddingInline: 16,
          paddingBlock: 16,
        },
        ...layoutStyle,
      }}
    >
      <MainHeader title={headerTitle ?? currentMenu?.name ?? ''} />
      {children}
    </FlexColumn>
  );
}
