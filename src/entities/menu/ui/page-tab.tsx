import { useLocation, useNavigate } from 'react-router-dom';
import { RefObject, useEffect, useState } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { IoClose } from 'react-icons/io5';

import { Button, FlexColumn, FlexRow } from '@/shared/components';
import { CacheNode, menus, TMenu } from '@/entities/menu';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname + location.search;

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
              paddingBlock: 4,
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
                      paddingLeft: 12,
                      paddingRight: 6,
                      paddingBlock: 4,
                      gap: 6,
                      alignItems: 'center',
                    }}
                    onClick={() => toMenu(findCacheMenu)}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <span>{findCacheMenu.name}</span>
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

      <div style={{ height: 1, width: '100%', backgroundColor: '#dcdcdc' }}></div>
    </FlexColumn>
  );
}
