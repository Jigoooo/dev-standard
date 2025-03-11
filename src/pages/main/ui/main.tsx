import { useEffect } from 'react';
import { useKeepAliveRef } from 'keepalive-for-react';
import KeepAliveRouteOutlet from 'keepalive-for-react-router';
import { useLocation, useNavigate } from 'react-router-dom';

import { FlexColumn, FlexRow } from '@/shared/components';
import { PageTab, Router, Sidebar, useRouterMenuContext, useRouterState } from '@/entities/router';
import { KeepAliveWrapper, MainHeader } from '@/entities/main';

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

  // useEffect(() => {
  //   if (sidebarMainMenus.length > 0) {
  //     navigate(sidebarMainMenus[0].fullRouterPath);
  //   }
  // }, [sidebarMainMenus]);

  useEffect(() => {
    updateMainRouteChildren([
      {
        MAIN_CD: 0,
        SUB1_CD: 0,
        SUB2_CD: 1,
        ORDER_BY: 0,
        MENU_ID: 'ui',
        MENU_TITLE: 'UI 컴포넌트',
        MENU_LINK: '/main/ui',
        DISPLAY_YN: 'Y',
      },
      {
        MAIN_CD: 0,
        SUB1_CD: 0,
        SUB2_CD: 2,
        ORDER_BY: 1,
        MENU_ID: 'grid-example',
        MENU_TITLE: '그리드 예시',
        MENU_LINK: '/main/grid-example',
        DISPLAY_YN: 'Y',
      },
      {
        MAIN_CD: 0,
        SUB1_CD: 0,
        SUB2_CD: 3,
        ORDER_BY: 2,
        MENU_ID: 'file-upload-download',
        MENU_TITLE: '파일 업로드/다운로드',
        MENU_LINK: '/main/file-upload-download',
        DISPLAY_YN: 'Y',
      },
      {
        MAIN_CD: 0,
        SUB1_CD: 0,
        SUB2_CD: 4,
        ORDER_BY: 3,
        MENU_ID: 'excel-upload-download',
        MENU_TITLE: 'Excel 업로드/다운로드',
        MENU_LINK: '/main/excel-upload-download',
        DISPLAY_YN: 'Y',
      },
      {
        MAIN_CD: 0,
        SUB1_CD: 0,
        SUB2_CD: 5,
        ORDER_BY: 4,
        MENU_ID: 'role-management',
        MENU_TITLE: '메뉴/버튼 권한관리',
        MENU_LINK: '/main/role-management',
        DISPLAY_YN: 'Y',
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
