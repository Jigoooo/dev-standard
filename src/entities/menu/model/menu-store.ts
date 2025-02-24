import { create } from 'zustand';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RoomIcon from '@mui/icons-material/Room';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

import { TMenuState, TMenuStore } from '@/entities/menu/model/menu-type.ts';
import { TMenu } from '@/entities/menu';
import { Router } from '@/entities/router';
import { useShallow } from 'zustand/react/shallow';

export const menus: TMenu[] = [
  {
    name: '홈',
    icon: HomeOutlinedIcon,
    router: Router.HOME,
  },
  {
    name: '위치관리',
    icon: RoomIcon,
    router: Router.LOCATION_MANAGEMENT,
  },
  {
    name: '물품관리',
    icon: ArticleOutlinedIcon,
    router: Router.OBJECT_MANAGEMENT,
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
