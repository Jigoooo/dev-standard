import { useLocation, useNavigate } from 'react-router-dom';
import { RefObject, useEffect, useState } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { IoClose } from 'react-icons/io5';

import { Button, Divider, FlexColumn, FlexRow, Typography } from '@/shared/components';
import { CacheNode, menus, TMenu, useMenuState } from '@/entities/menu';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuState = useMenuState();

  const [sortedCacheNodes, setSortedCacheNodes] = useState<CacheNode[]>([]);

  useEffect(() => {
    const nodes = aliveRef?.current?.getCacheNodes() ?? [];
    const sorted = [...nodes].sort((a, b) => {
      const menuA = menus.find((menu) => a.cacheKey.includes(menu.router));
      const menuB = menus.find((menu) => b.cacheKey.includes(menu.router));
      return (menuA?.menuIndex ?? 0) - (menuB?.menuIndex ?? 0);
    });
    setSortedCacheNodes(sorted);
  }, [aliveRef, location]);

  const destroyCacheNode = (cacheKey: string) => {
    aliveRef?.current?.destroy(cacheKey).then(() => {
      setSortedCacheNodes((prev) => prev.filter((node) => node.cacheKey !== cacheKey));
    });
  };

  const currentMenu = menuState.selectedMenu;

  const toMenu = (menu: TMenu) => {
    navigate(menu.router);
  };

  return (
    <FlexColumn
      style={{ userSelect: 'none', minHeight: 50, height: 50, maxHeight: 50, width: '100%' }}
    >
      <LayoutGroup>
        <FlexRow style={{ alignItems: 'center', gap: 16 }}>
          <FlexRow
            as={motion.div}
            layoutId='current-tab'
            style={{
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              width: 260,
              borderTop: '1px solid #cccccc',
              borderLeft: '1px solid #cccccc',
              borderRight: '1px solid #cccccc',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              paddingInline: 8,
              paddingBlock: 4,
              backgroundColor: '#ffffff',
            }}
          >
            <Typography
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                // color: '#ffffff',
              }}
            >
              {currentMenu?.name}
            </Typography>
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
                      border: '1px solid #bbbbbb',
                      borderRadius: 4,
                      paddingLeft: 12,
                      paddingRight: 6,
                      paddingBlock: 4,
                      gap: 6,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => toMenu(findCacheMenu)}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <Typography style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      {findCacheMenu.name}
                    </Typography>
                    <Button
                      style={{
                        padding: 0,
                        height: 22,
                        width: 22,
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        destroyCacheNode(cacheNode.cacheKey);
                      }}
                    >
                      <IoClose style={{ color: '#000000' }} />
                    </Button>
                  </FlexRow>
                );
              })}
            </AnimatePresence>
          </FlexRow>
        </FlexRow>
      </LayoutGroup>

      <Divider style={{ backgroundColor: '#cccccc' }} />
    </FlexColumn>
  );
}
