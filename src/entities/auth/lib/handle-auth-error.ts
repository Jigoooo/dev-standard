import { getToken, setToken } from '../lib';
import { tokenRefreshApi } from '../api';
import { TAuthErrorHandlerOptions } from '../model/auth-type.ts';
import { dialogActions, DialogType } from '@/shared/ui';

export async function handleAuthError(options: TAuthErrorHandlerOptions): Promise<boolean> {
  const { data, onUnauthenticated, onOtherError, onRefreshSuccess } = options;

  if (data.success) return false;
  if (data.code === 401 || data.code === 403) {
    const token = getToken();
    if (token === null) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
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
        dialogActions.open({
          dialogType: DialogType.ERROR,
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
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: data.msg || '오류가 발생하였습니다.',
        contents: '관리자에게 문의해 주세요.',
        overlayClose: false,
      });
    }
  }
  return true;
}
