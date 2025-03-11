import { CSSProperties, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { MainHeader } from './main-header.tsx';
import { FlexColumn } from '@/shared/components';
import { menus, sidebarMainMenus, useRouterState } from '@/entities/router';

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
  const currentMenu =
    menus.find((menu) => location.pathname.startsWith(menu.fullRouterPath)) ??
    (sidebarMainMenus.length > 0 ? sidebarMainMenus[0] : undefined);

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
