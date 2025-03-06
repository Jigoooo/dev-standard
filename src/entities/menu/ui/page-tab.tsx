import { useLocation, useNavigate } from 'react-router-dom';
import { RefObject } from 'react';
import { KeepAliveRef } from 'keepalive-for-react';

import { FlexColumn, FlexRow } from '@/shared/components';
import { menus, TMenu } from '@/entities/menu';

export function PageTab({ aliveRef }: { aliveRef: RefObject<KeepAliveRef | undefined> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const cacheNodes = aliveRef?.current?.getCacheNodes() ?? [];

  const currentMenu = menus.find((menu) => activePath.includes(menu.router));

  const toMenu = (menu: TMenu) => {
    if (!menu) {
      return;
    }

    navigate(menu.router);
  };

  return (
    <FlexColumn style={{ minHeight: 50, height: 50, maxHeight: 50, width: '100%', gap: 4 }}>
      <FlexRow style={{ alignItems: 'center', gap: 16 }}>
        <FlexRow
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
          {cacheNodes.map((cacheNode) => {
            const findCacheMenu = menus.find((menu) => cacheNode.cacheKey.includes(menu.router));

            if (currentMenu === findCacheMenu || !findCacheMenu) {
              return null;
            }

            return (
              <FlexRow
                key={cacheNode.cacheKey}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #dcdcdc',
                  borderRadius: 4,
                  paddingInline: 8,
                }}
                onClick={() => toMenu(findCacheMenu)}
              >
                <span>{findCacheMenu.name}</span>
              </FlexRow>
            );
          })}
        </FlexRow>
      </FlexRow>

      <div style={{ height: 1, width: '100%', backgroundColor: '#dcdcdc' }}></div>
    </FlexColumn>
  );
}
