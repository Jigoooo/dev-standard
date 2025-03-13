import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Router, useGetMenuMemberAuthApiQuery } from '@/entities/router';

export function MenuAuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const menuId = location.pathname.split('/').pop();

  // const { menus } = useRouterMenuContext();

  const menuAuthResponse = useGetMenuMemberAuthApiQuery({
    menuId: menuId ?? '',
  });

  console.log(menuAuthResponse.data?.data?.menuMemberAuth);

  if (
    !menuId ||
    !menuAuthResponse.data?.success ||
    menuAuthResponse.data?.data?.menuMemberAuth?.useYn !== 'Y'
  ) {
    return <Navigate to={Router.SIGN_IN} replace />;
  }

  return <>{children}</>;
}
