import '@/app/providers/css';

import { RouterProvider } from 'react-router-dom';

import { browserRouter } from '@/app/router';
import {
  LoadingProvider,
  ThemeProvider,
  ErrorProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
} from '@/app/providers';

function App() {
  return (
    <ErrorProvider>
      <QueryProvider>
        <ThemeProvider>
          <ModalProvider>
            <RouterProvider router={browserRouter} />
            <LoadingProvider />
            <AlertProvider />
          </ModalProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorProvider>
  );
}

export default App;
