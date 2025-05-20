import type { MenuMemberAuthResponse, MeResponse } from '@/shared/api';

export type MenuMemberAuthType = MenuMemberAuthResponse & {
  allChecked: boolean;
};

export type MeState = {
  me: MeResponse;
};

export type MeStore = {
  state: MeState;
  actions: {
    setMe: (me: MeResponse) => void;
  };
};
