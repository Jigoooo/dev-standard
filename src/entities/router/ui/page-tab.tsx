import { useLocation, useNavigate } from 'react-router-dom';
import { RefObject, useEffect, useState } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { IoClose } from 'react-icons/io5';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { IoIosCloseCircleOutline } from 'react-icons/io';

import { Button, Divider, FlexColumn, FlexRow, Typography } from '@/shared/components';
import { CacheNode, routerComponentMap, TMenu, useRouterMenuContext } from '@/entities/router';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { menus, sidebarMainMenus } = useRouterMenuContext();

  const activeCacheKey = location.pathname + location.search;

  const [sortedCacheNodes, setSortedCacheNodes] = useState<CacheNode[]>([]);
  const remainingCacheNodes = sortedCacheNodes.filter((node) => node.cacheKey !== activeCacheKey);

  useEffect(() => {
    const nodes = aliveRef?.current?.getCacheNodes() ?? [];
    const sorted = [...nodes].sort((a, b) => {
      const menuA = sidebarMainMenus.find((menu) => a.cacheKey.includes(menu.router));
      const menuB = sidebarMainMenus.find((menu) => b.cacheKey.includes(menu.router));
      return (menuA?.menuIndex ?? 0) - (menuB?.menuIndex ?? 0);
    });
    setSortedCacheNodes(sorted);
  }, [aliveRef, location]);

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

  const currentMenu =
    menus.find((menu) => location.pathname.startsWith(menu.fullRouterPath)) ??
    (sidebarMainMenus.length > 0 ? sidebarMainMenus[0] : undefined);

  const toMenu = (menu: TMenu) => {
    if (!routerComponentMap[menu.router]) {
      return;
    }

    navigate(menu.router);
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
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 260,
              width: 260,
              maxWidth: 260,
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
              }}
            >
              {currentMenu?.name}
            </Typography>
          </FlexRow>
          <FlexRow
            style={{
              scrollbarWidth: 'none',
              alignItems: 'center',
              gap: 8,
              height: 32,
              overflowY: 'auto',
              minWidth: 'calc(100% - 340px)',
              width: 'calc(100vw - 340px)',
              maxWidth: 'calc(100% - 340px)',
              borderLeft: remainingCacheNodes.length > 0 ? '1px solid #cccccc' : undefined,
              borderRight: remainingCacheNodes.length > 0 ? '1px solid #cccccc' : undefined,
              paddingInline: 8,
            }}
          >
            <AnimatePresence initial={false}>
              {sortedCacheNodes.map((cacheNode) => {
                const findCacheMenu = sidebarMainMenus.find((menu) =>
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
                      maxWidth: 200,
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
                    <Typography
                      style={{
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
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

      <Divider style={{ backgroundColor: '#cccccc' }} />
    </FlexColumn>
  );
}
