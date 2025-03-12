import { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { IoChevronDownOutline } from 'react-icons/io5';

import { FlexRow, Tooltip } from '@/shared/components';
import { TMenu, useRouterState } from '@/entities/router';

export function SidebarItem({
  style,
  isSelected,
  menu,
  onClickMenu,
}: {
  style?: CSSProperties;
  isSelected: boolean;
  menu: TMenu;
  onClickMenu: (menu: TMenu) => void;
}) {
  const routerState = useRouterState();

  return (
    <Tooltip
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      position={'right'}
      content={menu.name}
      disabled={!routerState.sidebarCollapsed}
    >
      <FlexRow
        as={motion.div}
        style={{
          ...{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBlock: 4,
            paddingInline: 14,
            cursor: 'pointer',
            color: isSelected ? '#4ba7ff' : '#999999',
            transition: 'all 0.1s',
            minHeight: 42,
            height: 42,
            maxHeight: 42,
          },
          ...style,
        }}
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          color: '#ffffff',
        }}
        transition={{
          duration: 0.04,
        }}
        onClick={() => {
          onClickMenu(menu);
        }}
      >
        <FlexRow style={{ gap: 12 }}>
          {menu.icon && (
            <menu.icon style={{ color: 'inherit', fontSize: '1.2rem', flexShrink: 0 }} />
          )}

          <AnimatePresence>
            {!routerState.delayedSidebarCollapsed && (
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

        {menu.isHeader && <IoChevronDownOutline style={{ color: '#ffffff', fontSize: '1.2rem' }} />}
      </FlexRow>
    </Tooltip>
  );
}
