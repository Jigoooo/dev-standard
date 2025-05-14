import { createContext, use } from 'react';

import type { RouterMenuContextType } from './router-type.ts';

export const RouterMenuContext = createContext<RouterMenuContextType | null>(null);

export const useRouterMenuContext = () => {
  const context = use(RouterMenuContext);

  if (!context) {
    throw new Error('useRouterMenuContext must be used within a RouterMenuContextProvider');
  } else {
    return context;
  }
};
