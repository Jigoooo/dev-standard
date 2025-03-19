import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { TSidebarState, TSidebarStore } from './router-type.ts';

const initialState: TSidebarState = {
  sidebarCollapsed: false,
  delayedSidebarCollapsed: false,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 0,
  sidebarBackgroundColor: '#1e232e',
};

const useSidebarStore = create<TSidebarStore>()((setState, getState) => {
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
                sidebarWidth: newSidebarCollapsed
                  ? initialState.sidebarCollapsedWidth
                  : initialState.sidebarWidth,
              },
            };
          }

          return {
            ...state,
            state: {
              ...state.state,
              sidebarCollapsed: newSidebarCollapsed,
              sidebarWidth: newSidebarCollapsed
                ? initialState.sidebarCollapsedWidth
                : initialState.sidebarWidth,
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

export const sidebarActions = useSidebarStore.getState().actions;
export const useSidebarState = () => useSidebarStore(useShallow((state) => state.state));
