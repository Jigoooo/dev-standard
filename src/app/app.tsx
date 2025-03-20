import '@/app/providers/css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { preconnect } from 'react-dom';

import { withRouterMenuHoc } from '@/app/providers';
import { useRouterMenuContext } from '@/entities/router';

if (import.meta.env.PROD) {
  (function () {
    const originalConsoleLog = console.log;
    console.log = function (...args) {
      if (
        args.some(
          (arg) =>
            typeof arg === 'string' &&
            (arg.includes('Unauthorized') || arg.includes('401') || arg.includes('403')),
        )
      ) {
        return;
      }
      originalConsoleLog.apply(console, args);
    };
  })();
}

function App() {
  preconnect(import.meta.env.VITE_DEV_API_TARGET_URL);

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      ReactGA.initialize([
        {
          trackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
        },
      ]);
    }
  }, []);

  const { routes } = useRouterMenuContext();
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default withRouterMenuHoc(App);
