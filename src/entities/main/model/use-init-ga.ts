import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { gaPageView } from '@/shared/lib';
import { useRouterMenuContext } from '@/entities/router';
import { useMeState } from '@/entities/member';

export function useInitGa() {
  const location = useLocation();
  const { findCurrentMenu } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);
  const memberInfo = useMeState();

  useEffect(() => {
    // if (!window.location.href.includes('localhost')) {
    if (!memberInfo.id) {
      return;
    }

    ReactGA.set({
      userId: memberInfo.id ?? 'none member id',
      // userName: memberInfo.memberNm ?? 'none member name',
    });
    // }
  }, [memberInfo]);

  useEffect(() => {
    // if (!window.location.href.includes('localhost')) {
    gaPageView({
      page: location.pathname,
      title: currentMenu?.title ?? 'unknown title',
    });
    // }
  }, [currentMenu?.title, location.pathname, location.search]);
}
