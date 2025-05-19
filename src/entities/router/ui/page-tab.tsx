import { useLocation, useNavigate } from 'react-router-dom';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import type { KeepAliveRef } from 'keepalive-for-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { IoClose } from 'react-icons/io5';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { IoIosCloseCircleOutline } from 'react-icons/io';

import { Button, Divider, FlexColumn, FlexRow, Typography } from '@/shared/ui';
import type { CacheNode, Menu } from '@/entities/router';
import { useRouterMenuContext } from '@/entities/router';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarMainMenus, findCurrentMenu, findMenuWithFullRouterPath } = useRouterMenuContext();
  const currentMenu = findCurrentMenu(location.pathname);

  const activeCacheKey = location.pathname + location.search;

  const [sortedCacheNodes, setSortedCacheNodes] = useState<CacheNode[]>([]);
  const remainingCacheNodes = sortedCacheNodes.filter((node) => node.cacheKey !== activeCacheKey);

  useEffect(() => {
    const nodes = aliveRef?.current?.getCacheNodes() ?? [];
    const sortedByTitle = [...nodes].sort((a, b) => {
      const menuA = sidebarMainMenus.find((menu) => a.cacheKey.includes(menu.id));
      const menuB = sidebarMainMenus.find((menu) => b.cacheKey.includes(menu.id));

      const titleA = (menuA?.title ?? '').trim();
      const titleB = (menuB?.title ?? '').trim();
      return titleA.localeCompare(titleB, ['ko', 'en'], {
        sensitivity: 'base',
        numeric: true,
      });
    });
    setSortedCacheNodes(sortedByTitle);
  }, [aliveRef, location, sidebarMainMenus]);

  const refreshCacheNode = () => {
    aliveRef?.current?.refresh();
  };

  const destroyCacheNode = (cacheKey: string) => {
    aliveRef?.current?.destroy(cacheKey).then(() => {
      setSortedCacheNodes((prevState) => prevState.filter((node) => node.cacheKey !== cacheKey));
    });
  };

  const destroyOtherCacheNodes = () => {
    aliveRef?.current?.destroyOther().then(() => {
      setSortedCacheNodes((prevState) =>
        prevState.filter((node) => node.cacheKey === activeCacheKey),
      );
    });
  };

  const toMenu = (menu: Menu) => {
    if (menu.isGroup) {
      return;
    }

    navigate(menu.link);
  };

  return (
    <FlexColumn
      style={{
        userSelect: 'none',
        minHeight: 50,
        height: 50,
        maxHeight: 50,
        width: '100%',
      }}
    >
      <LayoutGroup>
        <FlexRow
          style={{
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
            paddingRight: 12,
          }}
        >
          <FlexRow
            as={motion.div}
            layoutId='current-tab'
            style={{
              height: 45,
              alignItems: 'center',
              minWidth: 220,
              width: 220,
              paddingLeft: 16,
              paddingRight: 4,
              paddingBlock: 4,
              backgroundColor: '#ffffff',
              maxWidth: 220,
            }}
          >
            <Typography
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentMenu?.title}
            </Typography>
          </FlexRow>
          <FlexRow
            style={{
              scrollbarWidth: 'none',
              alignItems: 'center',
              gap: 8,
              height: 32,
              overflowY: 'auto',
              minWidth: 'calc(100% - 300px)',
              width: 'calc(100vw - 300px)',
              maxWidth: 'calc(100% - 300px)',
              borderLeft: remainingCacheNodes.length > 0 ? '1px solid #cccccc' : undefined,
              borderRight: remainingCacheNodes.length > 0 ? '1px solid #cccccc' : undefined,
              paddingInline: 8,
            }}
          >
            <AnimatePresence initial={false}>
              {sortedCacheNodes.map((cacheNode) => {
                const findCacheMenu = findMenuWithFullRouterPath(
                  sidebarMainMenus,
                  cacheNode.cacheKey,
                );

                if (currentMenu === findCacheMenu || !findCacheMenu) {
                  return null;
                }

                return (
                  <FlexRow
                    as={motion.div}
                    key={cacheNode.cacheKey}
                    style={{
                      maxWidth: 200,
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      border: '1px solid #cccccc',
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
                    <Typography
                      style={{
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {findCacheMenu.title}
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
          <FlexRow
            style={{
              alignItems: 'center',
              gap: 4,
            }}
          >
            <FlexRow
              as={motion.div}
              style={{ cursor: 'pointer', backgroundColor: '#ffffff', borderRadius: '50%' }}
              onClick={refreshCacheNode}
              whileHover={{ backgroundColor: '#eeeeee' }}
            >
              <IoRefreshCircleOutline style={{ fontSize: '1.6rem' }} />
            </FlexRow>
            {remainingCacheNodes.length > 0 && (
              <FlexRow
                as={motion.div}
                layout
                style={{ cursor: 'pointer', backgroundColor: '#ffffff', borderRadius: '50%' }}
                onClick={destroyOtherCacheNodes}
                whileHover={{ backgroundColor: '#eeeeee' }}
              >
                <IoIosCloseCircleOutline style={{ fontSize: '1.6rem' }} />
              </FlexRow>
            )}
          </FlexRow>
        </FlexRow>
      </LayoutGroup>

      <Divider style={{ backgroundColor: '#dadada' }} />
    </FlexColumn>
  );
}
