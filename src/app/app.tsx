import '@/app/providers/css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
  withRouterMenuProvider,
} from '@/app/providers';
import { useRouterMenuContext } from '@/entities/router';

function App() {
  const { routes } = useRouterMenuContext();
  const router = createBrowserRouter(routes);

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

export default withRouterMenuProvider(App);
