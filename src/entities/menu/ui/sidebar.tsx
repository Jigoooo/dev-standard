import { motion } from 'framer-motion';

import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

import { FlexColumn } from '@/shared/components';
import {
  MainMenuController,
  menuActions,
  menus,
  SidebarHeader,
  SidebarItems,
  useMenuState,
} from '@/entities/menu';

export function Sidebar({ headerTitle }: { headerTitle: string }) {
  const menuState = useMenuState();

  return (
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
          gap: 30,
        }}
      >
        <SidebarHeader title={headerTitle} />
        <SidebarItems menus={menus} />
      </FlexColumn>

      <motion.button
        animate={{ left: menuState.sidebarWidth }}
        onClick={menuActions.toggleSidebarCollapsed}
        style={{
          position: 'absolute',
          top: '40%',
          zIndex: 10,
          padding: '4px 8px',
          border: 'none',
          borderRadius: 4,
          backgroundColor: '#1e232e',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {menuState.sidebarCollapsed ? (
          <TbLayoutSidebarRightCollapseFilled />
        ) : (
          <TbLayoutSidebarLeftCollapseFilled />
        )}
      </motion.button>

      <MainMenuController />
    </motion.div>
  );
}
