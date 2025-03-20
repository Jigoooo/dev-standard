import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { gaPageView } from '@/shared/lib';
import { useRouterMenuContext } from '@/entities/router';

export function useInitGa() {
  const { findCurrentMenu } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);

  useEffect(() => {
    ReactGA.set({ userId: 'jeff test' });
  }, []);

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      gaPageView({
        page: location.pathname,
        title: currentMenu?.name ?? 'unknown title',
      });
    }
  }, [currentMenu?.name, location.pathname, location.search]);
}
