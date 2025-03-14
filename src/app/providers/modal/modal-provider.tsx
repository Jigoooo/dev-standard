import { ReactNode } from 'react';

import { ModalContextWrapper } from 'shared/ui';

export function ModalProvider({ children }: { children: ReactNode }) {
  return <ModalContextWrapper>{children}</ModalContextWrapper>;
}
