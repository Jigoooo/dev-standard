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
        path: Router.HOME,
        element: <Home />,
      },
    ],
  },
]);
