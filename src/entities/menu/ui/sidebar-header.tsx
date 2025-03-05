import { AnimatePresence, motion } from 'framer-motion';

import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

import { menuActions, useMenuState } from '@/entities/menu';
import { FlexRow } from '@/shared/components';

export function SidebarHeader({ title }: { title: string }) {
  const menuState = useMenuState();

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
      <div style={{ width: menuState.sidebarCollapsed ? 0 : 150, flexGrow: 1, overflow: 'hidden' }}>
        <AnimatePresence>
          {!menuState.sidebarCollapsed && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.1 }}
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
          flexGrow: menuState.sidebarCollapsed ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={menuActions.toggleSidebarCollapsed}
      >
        <AnimatePresence mode={'wait'}>
          {menuState.sidebarCollapsed ? (
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
