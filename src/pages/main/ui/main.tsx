import { useEffect } from 'react';
import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation, useNavigate } from 'react-router-dom';

import { FlexColumn, FlexRow } from '@/shared/components';
import {
  PageTab,
  Sidebar,
  useGetMenuListService,
  useRouterMenuContext,
  useRouterState,
} from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';
import { localStorageKey } from '@/shared/constants';

export function Main() {
  const navigate = useNavigate();
  const aliveRef = useKeepAliveRef();

  const location = useLocation();
  const routerState = useRouterState();

  const { sidebarMainMenus, updateMainRouteChildren, findCurrentMenu, excludeCacheMenuRouters } =
    useRouterMenuContext();
  const getMenuListService = useGetMenuListService();
  const currentMenu = findCurrentMenu(location.pathname);
  const isMatchedExcludeMenu = excludeCacheMenuRouters.includes(currentMenu?.fullRouterPath ?? '');

  useEffect(() => {
    if (sidebarMainMenus.length > 0) {
      const lastLocation = sessionStorage.getItem(localStorageKey.LAST_LOCATION);
      if (lastLocation) {
        navigate(lastLocation);
      } else {
        navigate(sidebarMainMenus[0].fullRouterPath);
      }
    }
  }, [sidebarMainMenus]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(localStorageKey.LAST_LOCATION, location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  const getMenuList = () => {
    getMenuListService.mutate(undefined, {
      onSuccess: (data) => {
        if (data.data) {
          console.log(data.data.menuList);
          updateMainRouteChildren(data.data.menuList);
        }
      },
    });
  };

  useEffect(() => {
    getMenuList();
  }, []);

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
