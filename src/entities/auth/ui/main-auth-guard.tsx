import { ReactNode, useEffect } from 'react';

import { useTokenCheckQuery } from '../api';
import { memberActions, useGetMemberInfoQuery } from '@/entities/member';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  const getMemberInfoQuery = useGetMemberInfoQuery();
  useTokenCheckQuery();

  useEffect(() => {
    if (getMemberInfoQuery.data?.data?.memberInfo) {
      memberActions.setMemberInfo(getMemberInfoQuery.data?.data?.memberInfo);
    }
  }, [getMemberInfoQuery.data?.data?.memberInfo]);

  return <>{children}</>;
}
