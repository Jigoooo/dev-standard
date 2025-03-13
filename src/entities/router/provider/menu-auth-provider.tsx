import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Router, useGetMenuMemberAuthApiQuery } from '@/entities/router';

export function MenuAuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuId = location.pathname.split('/').pop();

  // const { menus } = useRouterMenuContext();

  const menuAuthResponse = useGetMenuMemberAuthApiQuery({
    menuId: menuId ?? '',
  });

  useEffect(() => {
    if (menuAuthResponse.isFetching || !menuAuthResponse.data || !menuAuthResponse.data?.data) {
      return;
    }

    console.log(menuAuthResponse.data?.data?.menuMemberAuth);

    if (
      !menuAuthResponse.data.success ||
      menuAuthResponse.data.data.menuMemberAuth?.useYn !== 'Y'
    ) {
      navigate(Router.SIGN_IN, { replace: true });
    }
  }, [menuAuthResponse.data, menuAuthResponse.isFetching]);

  if (!menuId) {
    return <Navigate to={Router.SIGN_IN} replace />;
  }

  return <>{children}</>;
}
