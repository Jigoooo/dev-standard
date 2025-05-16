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
    id: Router.MY_PROFILE,
    title: '내정보',
    icon: getRouterMappedIcon(Router.MY_PROFILE),
    link: `${Router.MAIN}/${Router.MY_PROFILE}`,
    isDisplay: true,
    orderBy: 0,
    isGroup: false,
    children: [],
  },
];

export const excludeCacheMenuRouters = [
  `${Router.MAIN}/${Router.COMPONENT}`,
  `${Router.MAIN}/${Router.FILE}`,
  `${Router.MAIN}/${Router.MY_PROFILE}`,
];
