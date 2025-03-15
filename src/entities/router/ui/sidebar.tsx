import { motion } from 'framer-motion';

import { FlexColumn } from 'shared/ui';
import { SidebarHeader } from './sidebar-header';
import { SidebarItems } from './sidebar-items';
import { SidebarFooter } from './sidebar-footer';
import { useRouterMenuContext, useSidebarState } from '@/entities/router';

export function Sidebar({ headerTitle }: { headerTitle: string }) {
  const sidebarState = useSidebarState();
  const { sidebarMainMenus } = useRouterMenuContext();

  return (
    <div style={{ minWidth: sidebarState.sidebarWidth }}>
      <motion.div
        animate={{ width: sidebarState.sidebarWidth }}
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
            backgroundColor: sidebarState.sidebarBackgroundColor,
            height: '100%',
            paddingTop: 16,
            gap: 30,
          }}
        >
          <SidebarHeader title={headerTitle} />
          <SidebarItems
            menus={sidebarMainMenus}
            sidebarBackgroundColor={sidebarState.sidebarBackgroundColor}
          />
          <SidebarFooter />
        </FlexColumn>
      </motion.div>
    </div>
  );
}
