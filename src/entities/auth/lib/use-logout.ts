import { useNavigate } from 'react-router-dom';

import { Router, useRouterMenuContext } from '@/entities/router';
import { dialogActions, DialogType } from '@/shared/ui';
import { removeToken } from '@/entities/auth';

export function useLogout() {
  const { removeLastLocation } = useRouterMenuContext();
  const navigate = useNavigate();

  return () => {
    dialogActions.open({
      dialogType: DialogType.WARNING,
      title: '로그아웃을 진행하시겠습니까?',
      contents: '',
      withCancel: true,
      cancelText: '아니요',
      confirmText: '로그아웃',
      onConfirm: () => {
        removeToken();
        removeLastLocation();
        navigate(`${Router.SIGN_IN}?isLogout=true`, { replace: true });
      },
    });
  };
}
