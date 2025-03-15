import { useRouteError } from 'react-router-dom';
import { FlexColumn, Typography } from '@/shared/ui';

export function RouteErrorPage() {
  const error: any = useRouteError();

  console.error('error: --- ', error);

  return (
    <FlexColumn
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fcfcfc',
        gap: 36,
      }}
    >
      <Typography style={{ fontSize: '3rem', fontWeight: 600 }}>Route Error</Typography>
      <FlexColumn style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography style={{ fontSize: '2rem', fontWeight: 600 }}>
          {error.status} {error.statusText ? error.statusText : 'N/A'}
        </Typography>
        <Typography
          style={{
            fontSize: '1.4rem',
            fontWeight: 500,
            color: '#888888',
          }}
        >
          {error.error.message}
        </Typography>
      </FlexColumn>
    </FlexColumn>
  );
}
