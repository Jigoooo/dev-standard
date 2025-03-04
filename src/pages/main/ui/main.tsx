import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  MainMenuController,
  SidebarItems,
  menus,
  SidebarHeader,
  useMenuState,
  menuActions,
} from '@/entities/menu';
import { FlexColumn, FlexRow } from '@/shared/components';

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
      <motion.div
        animate={{ width: menuState.sidebarWidth, minWidth: menuState.sidebarWidth }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'relative',
          userSelect: 'none',
          height: '100%',
        }}
      >
        <FlexColumn
          style={{
            position: 'relative',
            backgroundColor: '#1e232e',
            height: '100%',
            paddingBlock: 16,
            gap: 15,
          }}
        >
          <SidebarHeader title={'Dev standard'} />
          <SidebarItems menus={menus} />
        </FlexColumn>

        <motion.button
          animate={{ left: menuState.sidebarWidth }}
          onClick={menuActions.toggleSidebarCollapsed}
          style={{
            position: 'absolute',
            top: '10%',
            zIndex: 10,
            padding: '4px 8px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: '#1e232e',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {menuState.sidebarCollapsed ? 'Expand' : 'Collapse'}
        </motion.button>
      </motion.div>

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

      <MainMenuController />
    </FlexRow>
  );
}
