import { createContext, use } from 'react';
import { TRouterMenuContext } from '@/entities/router/model/router-type.ts';

export const RouterMenuContext = createContext<TRouterMenuContext>(null);

export const useRouterMenuContext = () => {
  const context = use(RouterMenuContext);

  if (!context) {
    throw new Error('useRouterMenuContext must be used within a RouterMenuContextProvider');
  } else {
    return context;
  }
};
