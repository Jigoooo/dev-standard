import { useEffect } from 'react';
import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation, useNavigate } from 'react-router-dom';

import { FlexColumn, FlexRow } from '@/shared/components';
import { PageTab, Router, Sidebar, useRouterMenuContext, useRouterState } from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';
import { localStorageKey } from '@/shared/constants';

export function Main() {
  const navigate = useNavigate();
  const aliveRef = useKeepAliveRef();

  const location = useLocation();
  const routerState = useRouterState();
  const { menus, sidebarMainMenus, updateMainRouteChildren } = useRouterMenuContext();
  const excludeCacheMenuRouters = [`${Router.MAIN}/${Router.MY_PROFILE}`];

  const currentMenu =
    menus.find((menu) => location.pathname.startsWith(menu.fullRouterPath)) ??
    (sidebarMainMenus.length > 0 ? sidebarMainMenus[0] : undefined);

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

  useEffect(() => {
    updateMainRouteChildren([
      {
        mainCd: 0,
        sub1Cd: 0,
        sub2Cd: 0,
        orderBy: 0,
        menuId: 'component',
        menuTitle: '컴포넌트',
        menuLink: '/main/component',
        displayYn: 'Y',
      },
      {
        mainCd: 0,
        sub1Cd: 0,
        sub2Cd: 1,
        orderBy: 1,
        menuId: 'ui',
        menuTitle: 'UI',
        menuLink: '/main/component/ui',
        displayYn: 'Y',
      },
      {
        mainCd: 0,
        sub1Cd: 0,
        sub2Cd: 2,
        orderBy: 2,
        menuId: 'grid-example',
        menuTitle: '그리드 예시',
        menuLink: '/main/component/grid-example',
        displayYn: 'Y',
      },
      {
        mainCd: 1,
        sub1Cd: 0,
        sub2Cd: 0,
        orderBy: 0,
        menuId: 'file',
        menuTitle: '파일',
        menuLink: '/main/file',
        displayYn: 'Y',
      },
      {
        mainCd: 1,
        sub1Cd: 0,
        sub2Cd: 1,
        orderBy: 1,
        menuId: 'file-upload-download',
        menuTitle: '파일 업로드/다운로드',
        menuLink: '/main/file/file-upload-download',
        displayYn: 'Y',
      },
      {
        mainCd: 1,
        sub1Cd: 0,
        sub2Cd: 2,
        orderBy: 2,
        menuId: 'excel-upload-download',
        menuTitle: 'Excel 업로드/다운로드',
        menuLink: '/main/file/excel-upload-download',
        displayYn: 'Y',
      },
      {
        mainCd: 2,
        sub1Cd: 0,
        sub2Cd: 0,
        orderBy: 0,
        menuId: 'role-management',
        menuTitle: '메뉴/버튼 권한관리',
        menuLink: '/main/role-management',
        displayYn: 'Y',
      },
    ]);
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
