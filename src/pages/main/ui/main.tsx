import { Outlet } from 'react-router-dom';

import { menus } from '@/entities/menu';
import { MainMenuController, SidebarItems } from '@/widgets/main';
import { FlexColumn, FlexRow } from '@/shared/ui';

export function Main() {
  return (
    <FlexRow
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: 600,
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ minWidth: 250, width: 250, height: '100%' }}>
        <FlexColumn
          style={{
            position: 'relative',
            backgroundColor: '#1e232e',
            height: '100%',
            paddingBlock: 16,
            gap: 15,
          }}
        >
          <div style={{ paddingInline: 10, paddingBottom: 16 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              Home Manager
            </span>
          </div>
          <SidebarItems menus={menus} />
        </FlexColumn>
      </div>

      <FlexColumn style={{ flexGrow: 1, height: '100%', overflowX: 'auto', paddingInline: 16 }}>
        <Outlet />
      </FlexColumn>

      <MainMenuController />
    </FlexRow>
  );
}
