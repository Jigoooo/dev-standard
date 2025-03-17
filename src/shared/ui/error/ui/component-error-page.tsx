import { FallbackProps } from 'react-error-boundary';

import { Button, FlexColumn, Typography } from '@/shared/ui';

export function ComponentErrorPage({ error, resetErrorBoundary }: Readonly<FallbackProps>) {
  return (
    <FlexColumn
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fcfcfc',
        gap: 24,
      }}
    >
      <Typography style={{ fontSize: '2rem', fontWeight: 600 }}>Component Error</Typography>
      <FlexColumn style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          style={{
            fontSize: '1.4rem',
            fontWeight: 500,
            color: '#888888',
          }}
        >
          {error.message}
        </Typography>
      </FlexColumn>
      <Button onClick={resetErrorBoundary}>새로고침</Button>
    </FlexColumn>
  );
}
