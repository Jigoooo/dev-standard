import { createBrowserRouter } from 'react-router-dom';

import { RouteErrorPage } from '@/shared/components';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { Home } from '@/pages/home';
import { Router } from '@/entities/router';

export const browserRouter = createBrowserRouter([
  {
    path: Router.SIGN_IN,
    element: <SignIn />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: <Main />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: Router.MY_PROFILE,
        element: <Home />,
      },
      {
        path: Router.UI,
        element: <Home />,
      },
      {
        path: Router.FILE_UPLOAD_DOWNLOAD,
        element: <Home />,
      },
      {
        path: Router.EXCEL_UPLOAD_DOWNLOAD,
        element: <Home />,
      },
      {
        path: Router.ROLE_MANAGEMENT,
        element: <Home />,
      },
    ],
  },
]);
