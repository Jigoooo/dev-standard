import { useNavigate } from 'react-router-dom';

import { useRouterMenuContext } from '@/entities/router';
import { dialog } from '@/shared/ui';
import { logoutApi, removeToken } from '@/shared/api';
import { Router } from '@/shared/router';

export function useLogout() {
  const { removeLastLocation } = useRouterMenuContext();
  const navigate = useNavigate();

  return () => {
    dialog.warning({
      title: '로그아웃을 진행하시겠습니까?',
      contents: '',
      withCancel: true,
      cancelText: '아니요',
      confirmText: '로그아웃',
      onConfirm: () => {
        logoutApi().then(() => {
          removeToken();
        });

        removeLastLocation();
        navigate(`${Router.SIGN_IN}?isLogout=true`, { replace: true });
      },
    });
  };
}
