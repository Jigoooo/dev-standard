import { useEffect } from 'react';
import { useBeforeUnload, useNavigate } from 'react-router-dom';

import { Router, useRouterMenuContext } from '@/entities/router';

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
          navigate(firstNonHeaderMenu.fullRouterPath);
        } else {
          window.location.reload();
        }
      }
    } else {
      window.location.reload();
    }
  }, [lastLocation, sidebarMainMenus]);

  useBeforeUnload(() => {
    if (window.location.pathname !== Router.MAIN) {
      setLastLocation(window.location.pathname);
    }
  });
}
