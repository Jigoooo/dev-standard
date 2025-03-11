import '@/app/providers/css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
  withRouterMenuHoc,
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

export default withRouterMenuHoc(App);
