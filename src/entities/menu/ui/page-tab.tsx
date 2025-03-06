import { useLocation, useNavigate } from 'react-router-dom';
import { RefObject } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { FlexColumn, FlexRow } from '@/shared/components';
import { menus, TMenu } from '@/entities/menu';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const cacheNodes = aliveRef?.current?.getCacheNodes() ?? [];
  const sortedCacheNodes = [...cacheNodes].sort((a, b) => {
    const menuA = menus.find((menu) => a.cacheKey.includes(menu.router));
    const menuB = menus.find((menu) => b.cacheKey.includes(menu.router));
    return (menuA?.menuIndex ?? 0) - (menuB?.menuIndex ?? 0);
  });

  const currentMenu = menus.find((menu) => activePath.includes(menu.router));

  const toMenu = (menu: TMenu) => {
    navigate(menu.router);
  };

  return (
    <FlexColumn style={{ minHeight: 50, height: 50, maxHeight: 50, width: '100%', gap: 4 }}>
      <LayoutGroup>
        <FlexRow style={{ alignItems: 'center', gap: 16 }}>
          <FlexRow
            as={motion.div}
            layoutId='current-tab'
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 200,
              border: '1px solid #dcdcdc',
              borderRadius: 4,
              paddingInline: 8,
            }}
          >
            <span>{currentMenu?.name}</span>
          </FlexRow>
          <FlexRow style={{ alignItems: 'center', gap: 8 }}>
            <AnimatePresence initial={false}>
              {sortedCacheNodes.map((cacheNode) => {
                const findCacheMenu = menus.find((menu) =>
                  cacheNode.cacheKey.includes(menu.router),
                );

                if (currentMenu === findCacheMenu || !findCacheMenu) {
                  return null;
                }

                return (
                  <FlexRow
                    as={motion.div}
                    key={cacheNode.cacheKey}
                    style={{
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      border: '1px solid #dcdcdc',
                      borderRadius: 4,
                      paddingInline: 8,
                    }}
                    onClick={() => toMenu(findCacheMenu)}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <span>{findCacheMenu.name}</span>
                  </FlexRow>
                );
              })}
            </AnimatePresence>
          </FlexRow>
        </FlexRow>
      </LayoutGroup>

      <div style={{ height: 1, width: '100%', backgroundColor: '#dcdcdc' }}></div>
    </FlexColumn>
  );
}
