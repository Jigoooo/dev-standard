import { ReactNode } from 'react';

import { ModalContextWrapper } from '@/shared/components';

export function ModalProvider({ children }: { children: ReactNode }) {
  return <ModalContextWrapper>{children}</ModalContextWrapper>;
}
