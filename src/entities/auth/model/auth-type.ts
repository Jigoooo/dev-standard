import { RMenu } from '@/entities/router';

export type PSignIn = {
  id: string;
  password: string;
};

export type RSignIn = {
  accessToken: string;
  refreshToken: string;
  menuList: RMenu[];
};
