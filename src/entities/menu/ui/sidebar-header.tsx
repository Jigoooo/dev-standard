import { motion } from 'framer-motion';

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
      {!menuState.delayedSidebarCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}
        >
          {title}
        </motion.span>
      )}

      <FlexRow
        style={{
          flexGrow: menuState.sidebarCollapsed ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={menuActions.toggleSidebarCollapsed}
      >
        {menuState.sidebarCollapsed ? (
          <TbLayoutSidebarRightCollapseFilled style={{ fontSize: '1.2rem', color: '#ffffff' }} />
        ) : (
          <TbLayoutSidebarLeftCollapseFilled style={{ fontSize: '1.2rem', color: '#ffffff' }} />
        )}
      </FlexRow>
    </FlexRow>
  );
}
