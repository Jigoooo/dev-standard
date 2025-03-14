import { Navigate, useLocation, useRouteError } from 'react-router-dom';
import { Router } from '@/entities/router';

export function RouteErrorPage() {
  const error: any = useRouteError();
  const location = useLocation();

  if (error.status === 404 && location.pathname !== Router.SIGN_IN) {
    // todo 무한 루프 방지 필요 2번이상 진입 시 / 화면으로
    console.log('진입');
    return <Navigate to={Router.MAIN} replace />;
  }

  console.error('error: --- ', error);

  const styles = {
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100svh',
      textAlign: 'center',
      backgroundColor: '#f2f2f2',
      color: '#333',
    },
    errorMessage: {
      fontSize: '18px',
      color: '#666',
    },
    errorDetails: {
      marginTop: '20px',
      fontStyle: 'italic',
      color: '#999',
    },
  } as const;

  return (
    <div style={styles.errorContainer}>
      <h1>Error!!</h1>
      <p style={styles.errorMessage}>Sorry, an unexpected error has occurred.</p>
      <div style={styles.errorDetails}>
        <p>Status Text: {error.statusText ? error.statusText : 'N/A'}</p>
        <p>Error Message: {error.message}</p>
      </div>
    </div>
  );
}
