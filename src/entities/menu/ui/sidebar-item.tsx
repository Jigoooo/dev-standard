import { AnimatePresence, motion } from 'framer-motion';

import { menuActions, TMenu, useMenuState } from '@/entities/menu';
import { FlexRow, Tooltip } from '@/shared/components';

export function SidebarItem({
  isSelected,
  menu,
  onClickMenu,
}: {
  isSelected: boolean;
  menu: TMenu;
  onClickMenu: (menu: TMenu) => void;
}) {
  const menuState = useMenuState();

  return (
    <Tooltip
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      position={'right'}
      content={menu.name}
      disabled={!menuState.sidebarCollapsed}
    >
      <FlexRow
        as={motion.div}
        style={{
          width: '100%',
          gap: 12,
          alignItems: 'center',
          paddingBlock: 4,
          paddingInline: 14,
          cursor: 'pointer',
          color: isSelected ? '#4ba7ff' : '#999999',
          transition: 'all 0.1s',
          minHeight: 42,
          height: 42,
          maxHeight: 42,
        }}
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          color: '#ffffff',
        }}
        transition={{
          duration: 0.04,
        }}
        onClick={() => {
          if (isSelected) return;

          menuActions.setSelectedMenu(menu);
          onClickMenu(menu);
        }}
      >
        <menu.icon style={{ color: 'inherit', fontSize: '1.2rem', flexShrink: 0 }} />

        <AnimatePresence>
          {!menuState.delayedSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                color: 'inherit',
                fontSize: '0.84rem',
                fontWeight: 700,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {menu.name}
            </motion.span>
          )}
        </AnimatePresence>
      </FlexRow>
    </Tooltip>
  );
}
