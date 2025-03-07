import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';

import { dialogActions, DialogType } from '@/shared/components';

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    dialogActions.openDialog({
      dialogType: DialogType.WARNING,
      title: '로그아웃을 진행하시겠습니까?',
      contents: '',
      withCancel: true,
      cancelText: '아니요',
      confirmText: '로그아웃',
      onConfirm: () => {
        navigate(Router.SIGN_IN, { replace: true });
      },
    });
  };
}
