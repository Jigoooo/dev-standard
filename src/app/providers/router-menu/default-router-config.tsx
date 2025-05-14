import type { RouteObject } from 'react-router-dom';

import { AuthGuard, MainAuthGuard } from '@/features/auth';
import { ModalContextWrapper, RouteErrorPage } from '@/shared/ui';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import type { Menu } from '@/entities/router';
import { getRouterMappedIcon, Router } from '@/shared/router';
import { MyProfile } from '@/pages/my-profile';

export const defaultRoutes: RouteObject[] = [
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

export const defaultMenus: Menu[] = [
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
