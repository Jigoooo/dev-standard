import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { TRouterState, TRouterStore } from './router-type.ts';

const initialState: TRouterState = {
  sidebarCollapsed: false,
  delayedSidebarCollapsed: false,
  sidebarWidth: 280,
};

const useRouterStore = create<TRouterStore>()((setState, getState) => {
  return {
    state: {
      ...initialState,
    },
    actions: {
      toggleSidebarCollapsed: () => {
        const newSidebarCollapsed = !getState().state.sidebarCollapsed;

        setState((state) => {
          const newSidebarCollapsed = !state.state.sidebarCollapsed;

          if (newSidebarCollapsed) {
            return {
              ...state,
              state: {
                ...state.state,
                delayedSidebarCollapsed: newSidebarCollapsed,
                sidebarCollapsed: newSidebarCollapsed,
                sidebarWidth: newSidebarCollapsed ? 50 : initialState.sidebarWidth,
              },
            };
          }

          return {
            ...state,
            state: {
              ...state.state,
              sidebarCollapsed: newSidebarCollapsed,
              sidebarWidth: newSidebarCollapsed ? 50 : initialState.sidebarWidth,
            },
          };
        });

        setTimeout(() => {
          if (newSidebarCollapsed) {
            return;
          }

          setState((state) => ({
            ...state,
            state: {
              ...state.state,
              delayedSidebarCollapsed: state.state.sidebarCollapsed,
            },
          }));
        }, 200);
      },
    },
  };
});

export const routerActions = useRouterStore.getState().actions;
export const useRouterState = () => useRouterStore(useShallow((state) => state.state));
