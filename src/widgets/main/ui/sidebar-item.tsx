import { motion } from 'framer-motion';

import { menuActions, TMenu } from '@/entities/menu';
import { FlexRow } from '@/shared/ui';

export function SidebarItem({
  isSelected,
  menu,
  onClickMenu,
}: {
  isSelected: boolean;
  menu: TMenu;
  onClickMenu: (menu: TMenu) => void;
}) {
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
      <menu.icon sx={{ color: 'inherit', fontSize: '1.4rem' }} />
      <span style={{ color: 'inherit', fontSize: '0.84rem', fontWeight: 700 }}>{menu.name}</span>
    </FlexRow>
  );
}
