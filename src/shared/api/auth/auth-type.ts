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

export type CheckIdParameter = {
  id: string;
};

export type JoinData = {
  id: string;
  name: string;
  password: string;
  phoneNumber?: string;
  email?: string;
};
