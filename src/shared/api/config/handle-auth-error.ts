import { getToken, setToken } from './token-storage.ts';
import { dialog } from '@/shared/ui';
import type { AdapterResponseType } from '@/shared/api';
import { tokenRefreshApi } from '@/shared/api';

export async function handleAuthError(options: {
  data: AdapterResponseType<any>;
  onUnauthenticated: () => void;
  onOtherError?: () => void;
  onRefreshSuccess: () => void;
}): Promise<boolean> {
  const { data, onUnauthenticated, onOtherError, onRefreshSuccess } = options;

  if (data.isSuccess) return false;
  if (data.code === 401 || data.code === 403) {
    const token = getToken();
    if (token === null) {
      dialog.error({
        title: data.message || '세션이 만료되었습니다.',
        contents: '로그인을 다시 진행해 주세요.',
        onConfirm: onUnauthenticated,
        overlayClose: false,
      });
    } else {
      const refreshData = await tokenRefreshApi(token.refreshToken);
      if (
        !refreshData.isSuccess ||
        !refreshData?.data?.accessToken ||
        !refreshData?.data?.refreshToken ||
        !refreshData?.data?.expirationDate
      ) {
        dialog.error({
          title: data.message || '세션이 만료되었습니다.',
          contents: '로그인을 다시 진행해 주세요.',
          onConfirm: onUnauthenticated,
          overlayClose: false,
        });
        return true;
      }
      setToken({
        accessToken: refreshData.data.accessToken,
        refreshToken: refreshData.data.refreshToken,
        expirationDate: refreshData.data.expirationDate,
      });
      onRefreshSuccess();
    }
  } else {
    if (onOtherError) {
      onOtherError();
    } else {
      dialog.error({
        title: '오류가 발생하였습니다.',
        contents: data.message || '관리자에게 문의해 주세요.',
        overlayClose: false,
      });
    }
  }
  return true;
}
