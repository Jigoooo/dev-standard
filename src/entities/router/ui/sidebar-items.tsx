import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { SidebarItem } from './sidebar-item.tsx';
import { Divider, FlexColumn } from '@/shared/ui';
import type { Menu } from '@/entities/router';
import { useRouterMenuContext } from '@/entities/router';
import { gaEventTrigger } from '@/shared/lib';
import type { Router } from '@/shared/router';

export function SidebarItems({
  menus,
  sidebarBackgroundColor,
}: {
  menus: Menu[];
  sidebarBackgroundColor: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { findFirstNonHeaderMenu, lastLocation, setLastLocation } = useRouterMenuContext();

  const [secondDepthOpen, setSecondDepthOpen] = useState<{ router: Router; open: boolean }[]>([]);
  useEffect(() => {
    const openState = menus
      .filter((menu) => menu.isGroup)
      .map((menu) => {
        const firstNonHeaderMenu = findFirstNonHeaderMenu(menus);

        if (lastLocation && lastLocation.includes(menu.link)) {
          return {
            router: menu.id,
            open: true,
          };
        } else if (firstNonHeaderMenu && firstNonHeaderMenu.link.includes(menu.link)) {
          return {
            router: menu.id,
            open: true,
          };
        }

        return {
          router: menu.id,
          open: false,
        };
      });

    setSecondDepthOpen(openState);
  }, [findFirstNonHeaderMenu, lastLocation, menus]);

  const getSecondDepthOpen = (router: Router) => {
    return secondDepthOpen.find((openState) => openState.router === router)?.open ?? false;
  };

  const toggleSecondDepthOpen = (router: Router) => {
    setSecondDepthOpen((prevState) => {
      return prevState.map((openState) => {
        if (openState.router === router) {
          return {
            ...openState,
            open: !openState.open,
          };
        }

        return openState;
      });
    });
  };

  const onClickMenu = (menu: Menu, isSelected: boolean) => {
    if (menu.isGroup) {
      toggleSecondDepthOpen(menu.id);
      return;
    }

    if (isSelected) return;

    gaEventTrigger({
      action: 'click',
      category: 'sidebar',
      label: menu.title,
    });
    navigate(menu.id);
    setLastLocation(menu.link);
  };

  const onClickSecondDepthMenu = (parentMenu: Menu, childMenu: Menu, isSelected: boolean) => {
    if (childMenu.isGroup) {
      return;
    }

    if (isSelected) return;

    gaEventTrigger({
      action: 'click',
      category: 'sidebar',
      label: childMenu.title,
    });
    navigate(`${parentMenu.id}/${childMenu.id}`);
    setLastLocation(childMenu.link);
  };

  return (
    <LayoutGroup>
      <FlexColumn style={{ width: '100%', alignItems: 'center' }}>
        {menus.map((menu, menuIndex) => {
          if (!menu.isDisplay) {
            return null;
          }

          const isSelected = menu.id ? location.pathname.includes(menu.id) : false;
          const secondDepthMenus = menu.children;

          return (
            <FlexColumn style={{ width: '100%', overflow: 'hidden' }} key={menu.id}>
              <SidebarItem
                style={{ backgroundColor: sidebarBackgroundColor }}
                isSelected={isSelected}
                menu={menu}
                depthOpen={getSecondDepthOpen(menu.id)}
                onClickMenu={(menu) => onClickMenu(menu, isSelected)}
              />

              <AnimatePresence initial={false}>
                {secondDepthMenus && getSecondDepthOpen(menu.id) && (
                  <FlexColumn
                    as={motion.div}
                    style={{ width: '100%', marginTop: 4 }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {secondDepthMenus.map((secondDepthMenu) => {
                      if (!secondDepthMenu.isDisplay) {
                        return null;
                      }

                      const isSelected = secondDepthMenu.id
                        ? location.pathname.includes(secondDepthMenu.id)
                        : false;

                      return (
                        <SidebarItem
                          key={secondDepthMenu.id}
                          style={{ paddingLeft: 32, backgroundColor: sidebarBackgroundColor }}
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
