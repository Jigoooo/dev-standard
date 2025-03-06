import { FlexColumn, FlexRow } from '@/shared/components';
import { menus } from '@/entities/menu';
import { useLocation } from 'react-router-dom';
import { RefObject } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const cacheNodes = aliveRef?.current?.getCacheNodes() ?? [];

  const currentMenu = menus.find((menu) => activePath.includes(menu.router));

  return (
    <FlexColumn style={{ minHeight: 50, height: 50, maxHeight: 50, width: '100%' }}>
      <FlexRow>
        <FlexRow>
          <span>{currentMenu?.name}</span>
        </FlexRow>
        {cacheNodes.map((cacheNode) => {
          const findCacheMenu = menus.find((menu) => cacheNode.cacheKey.includes(menu.router));

          if (currentMenu === findCacheMenu) {
            return null;
          }

          console.log(findCacheMenu);
          return (
            <FlexRow key={cacheNode.cacheKey}>
              <span>{findCacheMenu?.name}</span>
            </FlexRow>
          );
        })}
      </FlexRow>

      <div style={{ height: 1, width: '100%', backgroundColor: '#dcdcdc' }}></div>
    </FlexColumn>
  );
}
