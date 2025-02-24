import { FallbackProps } from 'react-error-boundary';

import { logOnDev } from '@/shared/lib';

export function ComponentErrorPage({ error, resetErrorBoundary }: Readonly<FallbackProps>) {
  logOnDev(`error: ${error}`);
  logOnDev(`resetErrorBoundary: ${resetErrorBoundary}`);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <h1>에러</h1>
      <p style={{ width: '100%' }}>
        <pre style={{ color: 'red' }}>{error.message}</pre>
      </p>
      <button onClick={resetErrorBoundary}>새로고침</button>
    </div>
  );
}
