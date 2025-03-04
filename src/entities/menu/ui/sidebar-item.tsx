import { motion } from 'framer-motion';

import { menuActions, TMenu, useMenuState } from '@/entities/menu';
import { FlexRow } from '@/shared/components';

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
    <FlexRow
      as={motion.div}
      style={{
        width: '100%',
        gap: 12,
        alignItems: 'center',
        padding: 8,
        cursor: 'pointer',
        color: isSelected ? '#4ba7ff' : '#999999',
        transition: 'all 0.1s',
        minHeight: 38,
        height: 38,
        maxHeight: 38,
      }}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        color: '#ffffff',
      }}
      transition={{
        duration: 0.1,
      }}
      onClick={() => {
        if (isSelected) return;

        menuActions.setSelectedMenu(menu);
        onClickMenu(menu);
      }}
    >
      <menu.icon style={{ color: 'inherit', fontSize: '1.2rem' }} />
      {!menuState.sidebarCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ color: 'inherit', fontSize: '0.84rem', fontWeight: 700 }}
        >
          {menu.name}
        </motion.span>
      )}
    </FlexRow>
  );
}
