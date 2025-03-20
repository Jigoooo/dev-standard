import { ReactNode, useEffect } from 'react';

import { useTokenCheckQuery } from '../api';
import { memberActions, useGetMemberInfoQuery } from '@/entities/member';
import { useInitGa, useInitLocation } from '@/entities/main';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  const getMemberInfoQuery = useGetMemberInfoQuery();
  useTokenCheckQuery();
  useInitLocation();
  useInitGa();

  useEffect(() => {
    if (getMemberInfoQuery.data?.data?.memberInfo) {
      memberActions.setMemberInfo(getMemberInfoQuery.data?.data?.memberInfo);
    }
  }, [getMemberInfoQuery.data?.data?.memberInfo]);

  return <>{children}</>;
}
