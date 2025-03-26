import { RMenu } from '@/shared/api';

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
