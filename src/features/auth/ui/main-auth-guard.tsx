import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { memberActions, useMemberState } from '@/entities/member';
import { useTokenCheckQuery, useGetMemberQuery } from '@/shared/api';
import { useInitGa } from '@/entities/main';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  const memberState = useMemberState();
  const getMemberQuery = useGetMemberQuery({
    memberId: memberState.id,
  });
  useTokenCheckQuery();
  // useInitLocation();
  useInitGa();

  useEffect(() => {
    const member = getMemberQuery?.data?.data;
    if (member) {
      memberActions.setMember(member);
    }
  }, [getMemberQuery.data?.data]);

  return <>{children}</>;
}
