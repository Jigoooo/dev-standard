import '@/app/providers/css';

import { RouterProvider } from 'react-router-dom';

import { browserRouter } from '@/app/router';
import { LoadingProvider, AlertProvider, QueryProvider, ModalProvider } from '@/app/providers';

function App() {
  return (
    <QueryProvider>
      <ModalProvider>
        <RouterProvider router={browserRouter} />
        <LoadingProvider />
        <AlertProvider />
      </ModalProvider>
    </QueryProvider>
  );
}

export default App;
