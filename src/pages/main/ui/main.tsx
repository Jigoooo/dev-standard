import { useLocation } from 'react-router-dom';
import { useKeepAliveRef } from 'keepalive-for-react';
import { ReactNode, Suspense } from 'react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';

import { Sidebar, useMenuState } from '@/entities/menu';
import { Divider, FlexColumn, FlexRow } from '@/shared/components';
import { MainHeader } from '@/entities/main/ui/main-header.tsx';
import { Router } from '@/entities/router';

export function Main() {
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const aliveRef = useKeepAliveRef();

  const menuState = useMenuState();

  console.log('activePath: ', activePath);

  return (
    <FlexRow
      style={{
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        minHeight: 600,
        backgroundColor: '#ffffff',
      }}
    >
      <Sidebar headerTitle={'Dev standard'} />

      <FlexColumn
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          minWidth: 800,
          maxWidth: `calc(100vw - ${menuState.sidebarWidth}px)`,
          maxHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          paddingInline: 16,
          paddingBlock: 16,
        }}
      >
        <MainHeader title={menuState.selectedMenu.name} />
        <Divider style={{ marginBottom: 12 }} />

        <Suspense fallback={<div></div>}>
          <KeepAliveRouteOutlet
            wrapperComponent={MemoScrollTopWrapper}
            exclude={[`/${Router.MY_PROFILE}`]}
            aliveRef={aliveRef}
            duration={100}
            transition={true}
          />
        </Suspense>
      </FlexColumn>
    </FlexRow>
  );
}

function MemoScrollTopWrapper({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        height: 'calc(100vh - 110px)',
      }}
    >
      {children}
    </div>
  );
}
