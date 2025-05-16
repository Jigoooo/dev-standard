import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useGetMenuMemberAuthsQuery } from '@/shared/api';
import { useRouterMenuContext } from './';
import { useMeState } from '@/entities/member';

export function MenuAuthProvider({ children }: { children: ReactNode }) {
  const memberState = useMeState();
  const location = useLocation();
  const menuId = location.pathname.split('/').pop();

  const { setCurrentMenuMemberAuth } = useRouterMenuContext();

  const menuAuthResponse = useGetMenuMemberAuthsQuery({
    memberId: memberState.id,
    menuId: menuId ?? '',
  });

  useEffect(() => {
    if (
      menuAuthResponse.isFetching ||
      !menuAuthResponse.data?.data ||
      menuAuthResponse.data.data.length === 0
    ) {
      return;
    }

    setCurrentMenuMemberAuth(menuAuthResponse.data.data[0]);
  }, [menuAuthResponse.data, menuAuthResponse.isFetching, setCurrentMenuMemberAuth]);

  return <>{children}</>;
}
