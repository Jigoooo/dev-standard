import '@/app/providers/css';

import { RouterProvider } from 'react-router-dom';

import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
} from '@/app/providers';
import { router } from '@/entities/router';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
        <LoadingProvider />
        <AlertProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
