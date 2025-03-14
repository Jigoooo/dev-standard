import { motion } from 'framer-motion';

import { FlexColumn } from 'shared/ui';
import { SidebarHeader } from './sidebar-header';
import { SidebarItems } from './sidebar-items';
import { SidebarFooter } from './sidebar-footer';
import { useRouterMenuContext, useRouterState } from '@/entities/router';

export function Sidebar({ headerTitle }: { headerTitle: string }) {
  const routerState = useRouterState();
  const { sidebarMainMenus } = useRouterMenuContext();

  return (
    <div style={{ minWidth: routerState.sidebarWidth }}>
      <motion.div
        animate={{ width: routerState.sidebarWidth }}
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
            backgroundColor: routerState.sidebarBackgroundColor,
            height: '100%',
            paddingTop: 16,
            gap: 30,
          }}
        >
          <SidebarHeader title={headerTitle} />
          <SidebarItems
            menus={sidebarMainMenus}
            sidebarBackgroundColor={routerState.sidebarBackgroundColor}
          />
          <SidebarFooter />
        </FlexColumn>
      </motion.div>
    </div>
  );
}
