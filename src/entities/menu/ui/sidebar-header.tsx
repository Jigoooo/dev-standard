import { motion } from 'framer-motion';

import { useMenuState } from '@/entities/menu';
import { FlexRow } from '@/shared/components';

export function SidebarHeader({ title }: { title: string }) {
  const menuState = useMenuState();

  return (
    <FlexRow style={{ alignItems: 'center', paddingInline: 10, paddingBlock: 4, height: 42 }}>
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
    </FlexRow>
  );
}
