import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useGetMenuMemberAuthQuery } from '../api';
import { useRouterMenuContext } from './';

export function MenuAuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const menuId = location.pathname.split('/').pop();

  const { setCurrentMenuMemberAuth } = useRouterMenuContext();

  const menuAuthResponse = useGetMenuMemberAuthQuery({
    menuId: menuId ?? '',
  });

  useEffect(() => {
    if (menuAuthResponse.isFetching || !menuAuthResponse.data || !menuAuthResponse.data?.data) {
      return;
    }

    setCurrentMenuMemberAuth(menuAuthResponse.data.data.menuMemberAuth);
  }, [menuAuthResponse.data, menuAuthResponse.isFetching]);

  return <>{children}</>;
}
