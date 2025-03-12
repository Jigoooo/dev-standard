import { RMenu } from '@/entities/router';

export type PSignIn = {
  id: string;
  password: string;
};

export type RToken = {
  accessToken: string;
  refreshToken: string;
};

export type RSignIn = RToken & {
  menuList: RMenu[];
};
