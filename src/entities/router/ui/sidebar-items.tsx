import { useLocation, useNavigate } from 'react-router-dom';

import { SidebarItem } from './sidebar-item.tsx';
import { Divider, FlexColumn } from '@/shared/components';
import { TMenu } from '@/entities/router';

export function SidebarItems({ menus }: { menus: TMenu[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickMenu = (menu: TMenu) => {
    if (menu.isHeader) {
      return;
    }

    navigate(menu.router);
  };

  const onClickSecondDepthMenu = (parentMenu: TMenu, childMenu: TMenu) => {
    if (childMenu.isHeader) {
      return;
    }

    navigate(`${parentMenu.router}/${childMenu.router}`);
  };

  return (
    <FlexColumn style={{ width: '100%', alignItems: 'center' }}>
      {menus.map((menu, menuIndex) => {
        if (!menu.display) {
          return null;
        }

        const isSelected = menu.router ? location.pathname.includes(menu.router) : false;
        const secondDepthMenus = menu.children;

        return (
          <FlexColumn style={{ width: '100%' }} key={menu.router}>
            <SidebarItem isSelected={isSelected} menu={menu} onClickMenu={onClickMenu} />

            {secondDepthMenus && (
              <FlexColumn>
                {secondDepthMenus.map((secondDepthMenu) => {
                  if (!secondDepthMenu.display) {
                    return null;
                  }

                  const isSelected = secondDepthMenu.router
                    ? location.pathname.includes(secondDepthMenu.router)
                    : false;

                  return (
                    <SidebarItem
                      key={secondDepthMenu.router}
                      isSelected={isSelected}
                      menu={secondDepthMenu}
                      onClickMenu={(childMenu) => {
                        onClickSecondDepthMenu(menu, childMenu);
                      }}
                    />
                  );
                })}
              </FlexColumn>
            )}

            {menuIndex < menus.length - 1 && <Divider style={{ backgroundColor: '#424242' }} />}
          </FlexColumn>
        );
      })}
    </FlexColumn>
  );
}
