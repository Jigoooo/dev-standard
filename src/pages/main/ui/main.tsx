import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/entities/menu';
import { FlexColumn, FlexRow } from '@/shared/components';

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
      <Sidebar headerTitle={'Dev standard'} />

      <FlexColumn
        style={{
          flexGrow: 1,
          height: '100%',
          overflowX: 'auto',
          paddingInline: 16,
          paddingBottom: 16,
        }}
      >
        <Outlet />
      </FlexColumn>
    </FlexRow>
  );
}
