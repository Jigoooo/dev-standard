import { ReactNode } from 'react';

import { useTokenCheckQuery } from '@/entities/auth';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  useTokenCheckQuery();

  return <>{children}</>;
}
