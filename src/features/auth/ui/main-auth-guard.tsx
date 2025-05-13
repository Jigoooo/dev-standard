import { ReactNode, useEffect } from 'react';

import { memberActions } from '@/entities/member';
import { useTokenCheckQuery, useGetMemberInfoQuery } from '@/shared/api';
import { useInitGa, useInitLocation } from '@/entities/main';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  const getMemberInfoQuery = useGetMemberInfoQuery();
  useTokenCheckQuery();
  useInitLocation();
  useInitGa();

  useEffect(() => {
    if (getMemberInfoQuery.data?.data?.memberInfo) {
      const memberInfo = getMemberInfoQuery.data?.data?.memberInfo;
      memberActions.setMemberInfo(memberInfo);
    }
  }, [getMemberInfoQuery.data?.data?.memberInfo]);

  return <>{children}</>;
}
