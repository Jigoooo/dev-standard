import { getToken, setToken } from './token-storage.ts';
import { dialog } from '@/shared/ui';
import { tokenRefreshApi } from '@/shared/api';

export async function handleAuthError(options: {
  data: { success: boolean; code: number; msg?: string; [key: string]: any };
  onUnauthenticated: () => void;
  onOtherError?: () => void;
  onRefreshSuccess: () => void;
}): Promise<boolean> {
  const { data, onUnauthenticated, onOtherError, onRefreshSuccess } = options;

  if (data.success) return false;
  if (data.code === 401 || data.code === 403) {
    const token = getToken();
    if (token === null) {
      dialog.error({
        title: data.msg || '세션이 만료되었습니다.',
        contents: '로그인을 다시 진행해 주세요.',
        onConfirm: onUnauthenticated,
        overlayClose: false,
      });
    } else {
      const refreshData = await tokenRefreshApi(token.refreshToken);
      if (
        !refreshData.success ||
        !refreshData?.data?.accessToken ||
        !refreshData?.data?.refreshToken ||
        !refreshData?.data?.expiresIn
      ) {
        dialog.error({
          title: data.msg || '세션이 만료되었습니다.',
          contents: '로그인을 다시 진행해 주세요.',
          onConfirm: onUnauthenticated,
          overlayClose: false,
        });
        return true;
      }
      setToken({
        accessToken: refreshData.data.accessToken,
        refreshToken: refreshData.data.refreshToken,
        expiresIn: refreshData.data.expiresIn,
      });
      onRefreshSuccess();
    }
  } else {
    if (onOtherError) {
      onOtherError();
    } else {
      dialog.error({
        title: '오류가 발생하였습니다.',
        contents: data.msg || '관리자에게 문의해 주세요.',
        overlayClose: false,
      });
    }
  }
  return true;
}
