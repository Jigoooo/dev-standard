import { useEffect } from 'react';
import { useBeforeUnload, useNavigate } from 'react-router-dom';

import { useRouterMenuContext } from '@/entities/router';
import { Router } from '@/shared/router';

export function useInitLocation() {
  const navigate = useNavigate();

  const { sidebarMainMenus, findFirstNonHeaderMenu, lastLocation, setLastLocation } =
    useRouterMenuContext();

  useEffect(() => {
    if (sidebarMainMenus.length > 0) {
      if (lastLocation) {
        navigate(lastLocation);
      } else {
        const firstNonHeaderMenu = findFirstNonHeaderMenu(sidebarMainMenus);

        if (firstNonHeaderMenu !== null) {
          navigate(firstNonHeaderMenu.link);
        } else {
          window.location.reload();
        }
      }
    } else {
      window.location.reload();
    }
  }, [findFirstNonHeaderMenu, lastLocation, navigate, sidebarMainMenus]);

  useBeforeUnload(() => {
    if (window.location.pathname !== Router.MAIN) {
      setLastLocation(window.location.pathname);
    }
  });
}
