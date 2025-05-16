import type { MeResponse } from '@/shared/api';

export type MeState = {
  me: MeResponse;
};

export type MeStore = {
  state: MeState;
  actions: {
    setMe: (me: MeResponse) => void;
  };
};
