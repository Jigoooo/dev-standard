import { ComponentType } from 'react';
import { RouteObject } from 'react-router-dom';

import { getRouterMappedIcon, RouterMenuContextWrapper, TMenu } from '@/entities/router';
import {
  AlertProvider,
  ErrorProvider,
  LoadingProvider,
  QueryProvider,
  ThemeProvider,
} from '@/app/providers';
import { Router } from '@/shared/router';
import { AuthGuard, MainAuthGuard } from '@/entities/auth';
import { ModalContextWrapper, RouteErrorPage } from '@/shared/ui';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';

const defaultRoutes: RouteObject[] = [
  {
    path: Router.SIGN_IN,
    element: (
      <AuthGuard>
        <ModalContextWrapper>
          <SignIn />
        </ModalContextWrapper>
      </AuthGuard>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: (
      <MainAuthGuard>
        <ModalContextWrapper>
          <Main />
        </ModalContextWrapper>
      </MainAuthGuard>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: Router.MY_PROFILE,
        element: <MyProfile />,
      },
    ],
  },
];

const defaultMenus: TMenu[] = [
  {
    menuIndex: 9999,
    isHeader: false,
    name: '내정보',
    icon: getRouterMappedIcon(Router.MY_PROFILE),
    router: Router.MY_PROFILE,
    fullRouterPath: `${Router.MAIN}/${Router.MY_PROFILE}`,
    display: true,
    orderBy: 0,
    mainCd: 9999,
    sub1Cd: 0,
    sub2Cd: 0,
    menuId: Router.MY_PROFILE,
    menuLink: `${Router.MAIN}/${Router.MY_PROFILE}`,
    menuLinkDev: '',
  },
];

export function withRouterMenuHoc<P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  return function WithRouterMenuProvider(props: P) {
    return (
      <ThemeProvider>
        <LoadingProvider />
        <AlertProvider />
        <QueryProvider>
          <ErrorProvider>
            <RouterMenuContextWrapper defaultRoutes={defaultRoutes} defaultMenus={defaultMenus}>
              <WrappedComponent {...props} />
            </RouterMenuContextWrapper>
          </ErrorProvider>
        </QueryProvider>
      </ThemeProvider>
    );
  };
}
