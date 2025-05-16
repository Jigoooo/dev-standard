import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { meActions } from '@/entities/member';
import { useTokenCheckQuery, useGetMeQuery } from '@/shared/api';
import { useInitGa, useInitLocation } from '@/entities/main';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  const getMeQuery = useGetMeQuery();

  useTokenCheckQuery();
  useInitLocation();
  useInitGa();

  useEffect(() => {
    const me = getMeQuery?.data?.data;
    if (me) {
      meActions.setMe(me);
    }
  }, [getMeQuery.data?.data]);

  return <>{children}</>;
}
