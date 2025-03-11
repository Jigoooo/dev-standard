import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation } from 'react-router-dom';

import { FlexColumn, FlexRow } from '@/shared/components';
import { PageTab, Router, Sidebar, useRouterMenuContext, useRouterState } from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';

export function Main() {
  const aliveRef = useKeepAliveRef();

  const location = useLocation();
  const routerState = useRouterState();
  const { menus, sidebarMainMenus } = useRouterMenuContext();
  const excludeCacheMenuRouters = [`${Router.MAIN}/${Router.MY_PROFILE}`];

  const currentMenu =
    menus.find((menu) => location.pathname.startsWith(menu.fullRouterPath)) ??
    (sidebarMainMenus.length > 0 ? sidebarMainMenus[0] : undefined);

  const isMatchedExcludeMenu = excludeCacheMenuRouters.includes(currentMenu?.fullRouterPath ?? '');

  return (
    <FlexRow
      style={{
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        minHeight: 600,
        backgroundColor: '#eaeaea',
      }}
    >
      <Sidebar headerTitle={'Dev standard'} />

      <FlexRow style={{ width: '100%', overflowY: 'hidden', overflowX: 'auto' }}>
        <FlexColumn
          style={{
            flexGrow: 1,
            position: 'relative',
            backgroundColor: '#ffffff',
            width: '100%',
            minWidth: 800,
            maxWidth: `calc(100vw - ${routerState.sidebarWidth}px)`,
            maxHeight: '98vh',
            height: '100%',
            overflow: 'hidden',
            paddingBlock: 16,
            paddingLeft: 16,
            paddingRight: 8,
            marginInline: 12,
            marginBlock: '1vh',
            borderRadius: 8,
          }}
        >
          {isMatchedExcludeMenu ? (
            <MainHeader title={currentMenu?.name ?? ''} />
          ) : (
            <PageTab aliveRef={aliveRef} />
          )}

          <KeepAliveRouteOutlet
            wrapperComponent={KeepAliveWrapper}
            exclude={excludeCacheMenuRouters}
            aliveRef={aliveRef}
          />
        </FlexColumn>
      </FlexRow>
    </FlexRow>
  );
}
