import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation } from 'react-router-dom';

import { FlexColumn, FlexRow } from '@/shared/ui';
import {
  MenuAuthProvider,
  PageTab,
  Sidebar,
  useRouterMenuContext,
  useSidebarState,
} from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';

export function Main() {
  return (
    <FlexRow
      style={{
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        minHeight: '37.5rem',
        backgroundColor: '#eaeaea',
      }}
    >
      <Sidebar headerTitle={'Dev standard'} />
      <MainContainer />
    </FlexRow>
  );
}

function MainContainer() {
  const aliveRef = useKeepAliveRef();

  const location = useLocation();
  const sidebarState = useSidebarState();

  const { findCurrentMenu, excludeCacheMenuRouters } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);
  const isMatchedExcludeMenu = excludeCacheMenuRouters.includes(currentMenu?.link ?? '');

  return (
    <FlexRow style={{ width: '100%', overflowY: 'hidden', overflowX: 'auto' }}>
      <FlexColumn
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          minWidth: 800,
          maxWidth: `calc(100vw - ${sidebarState.sidebarWidth}px)`,
          maxHeight: '98vh',
          height: '100%',
          overflow: 'hidden',
          paddingBlock: '1rem',
          paddingLeft: '1rem',
          paddingRight: '0.5rem',
          marginInline: '0.75rem',
          marginBlock: '1vh',
          borderRadius: '0.5rem',
        }}
      >
        {isMatchedExcludeMenu ? (
          <MainHeader title={currentMenu?.title ?? ''} />
        ) : (
          <PageTab aliveRef={aliveRef} />
        )}

        <MenuAuthProvider>
          <KeepAliveRouteOutlet
            wrapperComponent={KeepAliveWrapper}
            exclude={excludeCacheMenuRouters}
            aliveRef={aliveRef}
          />
        </MenuAuthProvider>
      </FlexColumn>
    </FlexRow>
  );
}
