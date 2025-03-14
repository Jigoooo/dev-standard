import { useEffect } from 'react';
import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { FlexColumn, FlexRow } from '@/shared/components';
import {
  MenuAuthProvider,
  PageTab,
  Router,
  Sidebar,
  useGetMemberMenuListQuery,
  useRouterMenuContext,
  useRouterState,
} from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';
import { gaPageView } from '@/shared/lib';

export function Main() {
  const navigate = useNavigate();
  const aliveRef = useKeepAliveRef();

  const location = useLocation();
  const routerState = useRouterState();

  const {
    sidebarMainMenus,
    updateMainRouteChildren,
    findCurrentMenu,
    findFirstNonHeaderMenu,
    excludeCacheMenuRouters,
    lastLocation,
    setLastLocation,
  } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);
  const isMatchedExcludeMenu = excludeCacheMenuRouters.includes(currentMenu?.fullRouterPath ?? '');

  useEffect(() => {
    ReactGA.set({ userId: 'jeff test' });
  }, []);

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      gaPageView({
        page: location.pathname,
        title: currentMenu?.name ?? 'unknown title',
      });
    }
  }, [currentMenu?.name, location.pathname, location.search]);

  useEffect(() => {
    if (sidebarMainMenus.length > 0) {
      if (lastLocation) {
        navigate(lastLocation);
      } else {
        const firstNonHeaderMenu = findFirstNonHeaderMenu(sidebarMainMenus);
        if (firstNonHeaderMenu !== null) {
          navigate(firstNonHeaderMenu.fullRouterPath);
        }
      }
    }
  }, [lastLocation, sidebarMainMenus]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (location.pathname !== Router.MAIN) {
        setLastLocation(location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  const getMemberMenuListQuery = useGetMemberMenuListQuery();

  useEffect(() => {
    if (getMemberMenuListQuery?.data?.data) {
      updateMainRouteChildren(getMemberMenuListQuery?.data.data.menuList);
    }
  }, [getMemberMenuListQuery.data]);

  if (getMemberMenuListQuery.isFetching) {
    return null;
  }

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

          <MenuAuthProvider>
            <KeepAliveRouteOutlet
              wrapperComponent={KeepAliveWrapper}
              exclude={excludeCacheMenuRouters}
              aliveRef={aliveRef}
            />
          </MenuAuthProvider>
        </FlexColumn>
      </FlexRow>
    </FlexRow>
  );
}
