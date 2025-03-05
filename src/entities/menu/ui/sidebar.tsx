import { motion } from 'framer-motion';

import { FlexColumn } from '@/shared/components';
import {
  MainMenuController,
  menus,
  SidebarFooter,
  SidebarHeader,
  SidebarItems,
  useMenuState,
} from '@/entities/menu';

export function Sidebar({ headerTitle }: { headerTitle: string }) {
  const menuState = useMenuState();

  return (
    <motion.div
      animate={{ width: menuState.sidebarWidth, minWidth: menuState.sidebarWidth }}
      transition={{ duration: 0.2 }}
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
        <SidebarFooter />
      </FlexColumn>

      <MainMenuController />
    </motion.div>
  );
}
