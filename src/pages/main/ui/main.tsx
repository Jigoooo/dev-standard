import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';

import { MenuController, Sidebar, PageTab, useMenuState } from '@/entities/menu';
import { FlexColumn, FlexRow } from '@/shared/components';
import { Router } from '@/entities/router';
import { MainHeader, KeepAliveWrapper } from '@/entities/main';

export function Main() {
  const aliveRef = useKeepAliveRef();

  const menuState = useMenuState();

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

      <FlexColumn
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          minWidth: 800,
          maxWidth: `calc(100vw - ${menuState.sidebarWidth}px)`,
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
        <PageTab aliveRef={aliveRef} />

        <MainHeader title={menuState.selectedMenu.name} />

        <KeepAliveRouteOutlet
          wrapperComponent={KeepAliveWrapper}
          exclude={[`${Router.MAIN}/${Router.MY_PROFILE}`]}
          aliveRef={aliveRef}
        />
      </FlexColumn>

      <MenuController />
    </FlexRow>
  );
}
