import { create } from 'zustand';

import { RxComponent1 } from 'react-icons/rx';
import { RiFileExcel2Line } from 'react-icons/ri';
import { FaRegFile } from 'react-icons/fa';
import { MdOutlineManageAccounts } from 'react-icons/md';

import { TMenuState, TMenuStore } from '@/entities/menu/model/menu-type.ts';
import { TMenu } from '@/entities/menu';
import { Router } from '@/entities/router';
import { useShallow } from 'zustand/react/shallow';

export const menus: TMenu[] = [
  {
    name: 'UI 컴포넌트',
    icon: RxComponent1,
    router: Router.UI,
  },
  {
    name: '파일 업로드/다운로드',
    icon: FaRegFile,
    router: Router.FILE_UPLOAD_DOWNLOAD,
  },
  {
    name: '엑셀 업로드/다운로드',
    icon: RiFileExcel2Line,
    router: Router.EXCEL_UPLOAD_DOWNLOAD,
  },
  {
    name: '메뉴/버튼 권한관리',
    icon: MdOutlineManageAccounts,
    router: Router.ROLE_MANAGEMENT,
  },
] as const;

const initialState: TMenuState = {
  sidebarCollapsed: false,
  delayedSidebarCollapsed: false,
  sidebarWidth: 250,
  selectedMenu: menus[0],
};

const useMenuStore = create<TMenuStore>()((setState, getState) => {
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
      setSelectedMenu: (menu) => {
        setState((state) => {
          return {
            ...state,
            state: {
              ...state.state,
              selectedMenu: menu,
            },
          };
        });
      },
    },
  };
});

export const menuActions = useMenuStore.getState().actions;
export const useMenuState = () => useMenuStore(useShallow((state) => state.state));
