import '@tanstack/react-query';
import { AxiosError } from 'axios';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
  }
}