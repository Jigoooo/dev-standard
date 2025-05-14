import type { MenuResponse } from '@/shared/api';

export type SignInParameter = {
  id: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expirationDate: string;
};

export type SignInResponse = TokenResponse & {
  menus: MenuResponse[];
};
