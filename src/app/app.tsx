import '@/app/providers/css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
} from '@/app/providers';
import { Router } from '@/entities/router';
import { SignIn } from '@/pages/sign-in';
import { RouteErrorPage } from '@/shared/components';
import { Main } from '@/pages/main';
import { MyProfile } from '@/pages/my-profile';
import { generateRoutesFromMenu } from '@/app/router';
import { useMenuState } from '@/entities/menu';

function App() {
  const menuState = useMenuState();

  const router = createBrowserRouter([
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
          element: <MyProfile />,
        },
        ...generateRoutesFromMenu(menuState.menus),
      ],
    },
  ]);

  return (
    <QueryProvider>
      <ThemeProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
        <LoadingProvider />
        <AlertProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
