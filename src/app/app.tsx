import '@/app/providers/css';

import { RouterProvider } from 'react-router-dom';

import { browserRouter } from '@/app/router';
import {
  LoadingProvider,
  ThemeProvider,
  AlertProvider,
  QueryProvider,
  ModalProvider,
} from '@/app/providers';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ModalProvider>
          <RouterProvider router={browserRouter} />
          <LoadingProvider />
          <AlertProvider />
        </ModalProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
