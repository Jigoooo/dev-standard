import { useLocation } from 'react-router-dom';
import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';

import { Sidebar, useMenuState } from '@/entities/menu';
import { FlexColumn, FlexRow } from '@/shared/components';
import { MainHeader } from '@/entities/main/ui/main-header.tsx';
import { Router } from '@/entities/router';
import { KeepAliveWrapper } from '@/entities/main';

export function Main() {
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const aliveRef = useKeepAliveRef();

  const menuState = useMenuState();

  console.log('activePath: ', activePath);
  console.log('aliveRef: ', aliveRef?.current?.getCacheNodes());

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
          padding: 16,
          marginInline: 12,
          marginBlock: '1vh',
          borderRadius: 8,
        }}
      >
        <FlexColumn style={{ minHeight: 50, height: 50, maxHeight: 50, width: '100%' }}>
          <FlexRow>
            <FlexRow>
              <span>1</span>
            </FlexRow>
            <FlexRow>
              <span>2</span>
            </FlexRow>
            <FlexRow>
              <span>3</span>
            </FlexRow>
            <FlexRow>
              <span>4</span>
            </FlexRow>
          </FlexRow>
        </FlexColumn>

        <MainHeader title={menuState.selectedMenu.name} />

        <KeepAliveRouteOutlet
          wrapperComponent={KeepAliveWrapper}
          exclude={[`${Router.MAIN}/${Router.MY_PROFILE}`]}
          aliveRef={aliveRef}
        />
      </FlexColumn>
    </FlexRow>
  );
}
