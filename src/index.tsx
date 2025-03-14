import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/app/app.tsx';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('@/app/mocks');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
