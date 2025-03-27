import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { gaPageView } from '@/shared/lib';
import { useRouterMenuContext } from '@/entities/router';
import { useMemberState } from '@/entities/member';

export function useInitGa() {
  const location = useLocation();
  const { findCurrentMenu } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);
  const memberInfo = useMemberState();

  useEffect(() => {
    // if (!window.location.href.includes('localhost')) {
    if (!memberInfo.memberId) {
      return;
    }

    ReactGA.set({
      userId: memberInfo.memberId ?? 'none member id',
      // userName: memberInfo.memberNm ?? 'none member name',
    });
    // }
  }, [memberInfo]);

  useEffect(() => {
    // if (!window.location.href.includes('localhost')) {
    gaPageView({
      page: location.pathname,
      title: currentMenu?.name ?? 'unknown title',
    });
    // }
  }, [currentMenu?.name, location.pathname, location.search]);
}
