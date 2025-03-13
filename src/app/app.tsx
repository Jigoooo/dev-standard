import '@/app/providers/css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactGA from 'react-ga4';

import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
  withRouterMenuHoc,
} from '@/app/providers';
import { useRouterMenuContext } from '@/entities/router';

ReactGA.initialize([
  {
    trackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  },
]);

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
