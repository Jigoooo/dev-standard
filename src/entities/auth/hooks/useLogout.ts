import { openDialog } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    openDialog({
      color: 'warning',
      title: '로그아웃을 진행하시겠습니까?',
      contents: '자동로그인이 설정되어 있으면 해제됩니다.',
      withCancel: true,
      cancelText: '아니요',
      confirmText: '로그아웃',
      onConfirm: () => {
        navigate(Router.SIGN_IN, { replace: true });
      },
    });
  };
}
