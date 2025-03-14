import { AnimatePresence, motion } from 'framer-motion';

import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

import { FlexRow } from 'shared/ui';
import { routerActions, useRouterState } from '@/entities/router';

export function SidebarHeader({ title }: { title: string }) {
  const routerState = useRouterState();

  return (
    <FlexRow
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 12,
        paddingBlock: 4,
        height: 42,
      }}
    >
      <div
        style={{ width: routerState.sidebarCollapsed ? 0 : 150, flexGrow: 1, overflow: 'hidden' }}
      >
        <AnimatePresence>
          {!routerState.sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <FlexRow
        style={{
          flexGrow: routerState.sidebarCollapsed ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={routerActions.toggleSidebarCollapsed}
      >
        <AnimatePresence mode={'wait'}>
          {routerState.sidebarCollapsed ? (
            <motion.div
              key={'collapsed'}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
            >
              <TbLayoutSidebarRightCollapseFilled
                style={{ fontSize: '1.4rem', color: '#ffffff' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={'expanded'}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
            >
              <TbLayoutSidebarLeftCollapseFilled style={{ fontSize: '1.4rem', color: '#ffffff' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </FlexRow>
    </FlexRow>
  );
}
