import { ReactNode } from 'react';

export function KeepAliveWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: 'calc(100vh - 100px)',
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  );
}
