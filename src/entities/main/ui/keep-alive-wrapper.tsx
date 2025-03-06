import { ReactNode } from 'react';

export function KeepAliveWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: 'calc(100vh - 150px)',
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  );
}
