import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { SidebarItem } from './sidebar-item.tsx';
import { Divider, FlexColumn } from '@/shared/components';
import { TMenu, useRouterMenuContext } from '@/entities/router';

export function SidebarItems({ menus }: { menus: TMenu[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { lastLocation } = useRouterMenuContext();

  const [secondDepthOpen, setSecondDepthOpen] = useState<{ menuIndex: number; open: boolean }[]>(
    [],
  );
  useEffect(() => {
    const openState = menus
      .filter((menu) => menu.isHeader)
      .map((menu) => {
        if (lastLocation && lastLocation.includes(menu.fullRouterPath)) {
          return {
            menuIndex: menu.menuIndex,
            open: true,
          };
        }

        return {
          menuIndex: menu.menuIndex,
          open: false,
        };
      });

    setSecondDepthOpen(openState);
  }, [lastLocation, menus]);

  const getSecondDepthOpen = (menuIndex: number) => {
    return secondDepthOpen.find((openState) => openState.menuIndex === menuIndex)?.open ?? false;
  };

  const toggleSecondDepthOpen = (menuIndex: number) => {
    setSecondDepthOpen((prevState) => {
      return prevState.map((openState) => {
        if (openState.menuIndex === menuIndex) {
          return {
            ...openState,
            open: !openState.open,
          };
        }

        return openState;
      });
    });
  };

  const onClickMenu = (menu: TMenu, isSelected: boolean) => {
    if (menu.isHeader) {
      toggleSecondDepthOpen(menu.menuIndex);
      return;
    }

    if (isSelected) return;

    navigate(menu.router);
  };

  const onClickSecondDepthMenu = (parentMenu: TMenu, childMenu: TMenu, isSelected: boolean) => {
    if (childMenu.isHeader) {
      return;
    }

    if (isSelected) return;

    navigate(`${parentMenu.router}/${childMenu.router}`);
  };

  return (
    <LayoutGroup>
      <FlexColumn style={{ width: '100%', alignItems: 'center' }}>
        {menus.map((menu, menuIndex) => {
          if (!menu.display) {
            return null;
          }

          const isSelected = menu.router ? location.pathname.includes(menu.router) : false;
          const secondDepthMenus = menu.children;

          return (
            <FlexColumn style={{ width: '100%' }} key={menu.router}>
              <SidebarItem
                isSelected={isSelected}
                menu={menu}
                onClickMenu={(menu) => onClickMenu(menu, isSelected)}
              />

              <AnimatePresence initial={false}>
                {secondDepthMenus && getSecondDepthOpen(menu.menuIndex) && (
                  <FlexColumn
                    as={motion.div}
                    style={{ width: '100%', marginTop: 4 }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
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
                          style={{ paddingLeft: 32 }}
                          isSelected={isSelected}
                          menu={secondDepthMenu}
                          onClickMenu={(childMenu) => {
                            onClickSecondDepthMenu(menu, childMenu, isSelected);
                          }}
                        />
                      );
                    })}
                  </FlexColumn>
                )}
              </AnimatePresence>

              {menuIndex < menus.length - 1 && <Divider style={{ backgroundColor: '#424242' }} />}
            </FlexColumn>
          );
        })}
      </FlexColumn>
    </LayoutGroup>
  );
}
