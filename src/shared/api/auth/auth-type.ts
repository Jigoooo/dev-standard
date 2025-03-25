import { RMenu } from '@/entities/router';

export type TAuthErrorHandlerOptions = {
  data: { success: boolean; code: number; msg?: string; [key: string]: any };
  onUnauthenticated: () => void;
  onOtherError?: () => void;
  onRefreshSuccess: () => void;
};

export type PSignIn = {
  id: string;
  password: string;
};

export type RToken = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type RSignIn = RToken & {
  menuList: RMenu[];
};
