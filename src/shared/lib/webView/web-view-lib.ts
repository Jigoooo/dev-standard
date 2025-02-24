import { detectDeviceTypeAndOS } from '@/shared/lib';

export function sendPostMessage({ type, payload = {} }: { type: string; payload?: any }) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile && window?.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
  }
}
