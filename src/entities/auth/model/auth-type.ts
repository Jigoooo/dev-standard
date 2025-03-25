export type TAuthErrorHandlerOptions = {
  data: { success: boolean; code: number; msg?: string; [key: string]: any };
  onUnauthenticated: () => void;
  onOtherError?: () => void;
  onRefreshSuccess: () => void;
};
