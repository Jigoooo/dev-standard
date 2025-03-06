import '@/app/providers/css';

import { RouterProvider } from 'react-router-dom';

import { browserRouter } from '@/app/router';
import {
  LoadingProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
  ThemeProvider,
} from '@/app/providers';

function App() {
  return (
    <QueryProvider>
      <ModalProvider>
        <ThemeProvider>
          <RouterProvider router={browserRouter} />
          <LoadingProvider />
          <AlertProvider />
        </ThemeProvider>
      </ModalProvider>
    </QueryProvider>
  );
}

export default App;
