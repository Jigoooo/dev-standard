import { ReactNode } from 'react';

import { useTokenCheckQuery } from '../api';

export function MainAuthGuard({ children }: { children: ReactNode }) {
  useTokenCheckQuery();

  return <>{children}</>;
}
