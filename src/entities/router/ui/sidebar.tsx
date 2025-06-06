import { motion } from 'framer-motion';

import { FlexColumn } from '@/shared/ui';
import { SidebarHeader } from './sidebar-header';
import { SidebarItems } from './sidebar-items';
import { SidebarFooter } from './sidebar-footer';
import { sidebarActions, useRouterMenuContext, useSidebarState } from '@/entities/router';

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
        {sidebarState.sidebarCollapsed && (
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 10,
              height: '100%',
              width: '2.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.0)',
            }}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            transition={{ duration: 0.2 }}
            onClick={sidebarActions.toggleSidebarCollapsed}
          />
        )}
        <FlexColumn
          style={{
            position: 'relative',
            backgroundColor: sidebarState.sidebarBackgroundColor,
            height: '100%',
            paddingTop: '1rem',
            gap: '1.8rem',
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
