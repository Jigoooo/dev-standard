import { create } from 'zustand';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { TMenuState, TMenuStore } from '@/entities/menu/model/menu-type.ts';
import { TMenu } from '@/entities/menu';
import { Router } from '@/entities/router';
import { useShallow } from 'zustand/react/shallow';

export const menus: TMenu[] = [
  {
    name: 'UI 컴포넌트',
    icon: HomeOutlinedIcon,
    router: Router.UI,
  },
  {
    name: '파일 업로드/다운로드',
    icon: HomeOutlinedIcon,
    router: Router.FILE_UPLOAD_DOWNLOAD,
  },
  {
    name: '엑셀 업로드/다운로드',
    icon: HomeOutlinedIcon,
    router: Router.EXCEL_UPLOAD_DOWNLOAD,
  },
  {
    name: '메뉴/버튼 권한관리',
    icon: HomeOutlinedIcon,
    router: Router.ROLE_MANAGEMENT,
  },
] as const;

const initialState: TMenuState = {
  selectedMenu: menus[0],
};

const useMenuStore = create<TMenuStore>()((setState) => {
  return {
    state: {
      ...initialState,
    },
    actions: {
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
