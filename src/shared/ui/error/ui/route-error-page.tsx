import { Navigate, useLocation, useRouteError } from 'react-router-dom';
import { Router, useGetMemberMenuListQuery, useRouterMenuContext } from '@/entities/router';
import { FlexColumn, Typography } from '@/shared/ui';
import { useEffect } from 'react';

export function RouteErrorPage() {
  const error: any = useRouteError();
  const { updateMainRouteChildren } = useRouterMenuContext();
  const location = useLocation();

  const getMemberMenuListQuery = useGetMemberMenuListQuery();

  useEffect(() => {
    if (getMemberMenuListQuery?.data?.data && location.pathname.includes(Router.MAIN)) {
      updateMainRouteChildren(getMemberMenuListQuery?.data.data.menuList);
    }
  }, [getMemberMenuListQuery.data, location.pathname]);

  if (getMemberMenuListQuery.isFetching) {
    return null;
  }

  if (error.status === 404 && location.pathname !== Router.SIGN_IN) {
    // todo 무한 루프 방지 필요 2번이상 진입 시 / 화면으로
    console.log('RouteErrorPage');
    return <Navigate to={Router.MAIN} replace />;
  }

  console.error('error: --- ', error);

  return (
    <FlexColumn
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fcfcfc',
        gap: 36,
      }}
    >
      <Typography style={{ fontSize: '3rem', fontWeight: 600 }}>Route Error</Typography>
      <FlexColumn style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography style={{ fontSize: '2rem', fontWeight: 600 }}>
          {error.status} {error.statusText ? error.statusText : 'N/A'}
        </Typography>
        <Typography
          style={{
            fontSize: '1.4rem',
            fontWeight: 500,
            color: '#888888',
          }}
        >
          {error.error.message}
        </Typography>
      </FlexColumn>
    </FlexColumn>
  );
}
