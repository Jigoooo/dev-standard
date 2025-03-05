import { Outlet } from 'react-router-dom';

import { Sidebar, useMenuState } from '@/entities/menu';
import { Divider, FlexColumn, FlexRow } from '@/shared/components';
import { MainHeader } from '@/entities/main/ui/main-header.tsx';

export function Main() {
  const menuState = useMenuState();

  return (
    <FlexRow
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: 600,
        backgroundColor: '#ffffff',
      }}
    >
      <Sidebar headerTitle={'Dev standard'} />

      <FlexColumn
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: `calc(100vw - ${menuState.sidebarWidth}px)`,
          maxHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          paddingInline: 16,
          paddingBlock: 16,
        }}
      >
        <MainHeader title={menuState.selectedMenu.name} />
        <Divider style={{ marginBottom: 12 }} />
        <Outlet />
      </FlexColumn>
    </FlexRow>
  );
}
