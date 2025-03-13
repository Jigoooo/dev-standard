import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Router, useGetMenuMemberAuthApiQuery, useRouterMenuContext } from '@/entities/router';

export function MenuAuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuId = location.pathname.split('/').pop();

  const { setCurrentMenuMemberAuth } = useRouterMenuContext();

  const menuAuthResponse = useGetMenuMemberAuthApiQuery({
    menuId: menuId ?? '',
  });

  useEffect(() => {
    if (menuAuthResponse.isFetching || !menuAuthResponse.data || !menuAuthResponse.data?.data) {
      return;
    }

    if (!menuAuthResponse.data.success || menuAuthResponse.data.data.menuMemberAuth.useYn !== 'Y') {
      navigate(Router.SIGN_IN, { replace: true });
      return;
    }

    setCurrentMenuMemberAuth(menuAuthResponse.data.data.menuMemberAuth);
  }, [menuAuthResponse.data, menuAuthResponse.isFetching]);

  if (!menuId) {
    return <Navigate to={Router.SIGN_IN} replace />;
  }

  return <>{children}</>;
}
