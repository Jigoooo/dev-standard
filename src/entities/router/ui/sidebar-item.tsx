import { CSSProperties, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { IoChevronDownOutline } from 'react-icons/io5';

import { FlexRow, Tooltip } from '@/shared/ui';
import { TMenu, useSidebarState } from '@/entities/router';
import { useElementSize } from '@/shared/hooks';

export function SidebarItem({
  style,
  isSelected,
  menu,
  depthOpen = false,
  onClickMenu,
}: {
  style?: CSSProperties;
  isSelected: boolean;
  menu: TMenu;
  depthOpen?: boolean;
  onClickMenu: (menu: TMenu) => void;
}) {
  const sidebarState = useSidebarState();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemContainerSize = useElementSize(containerRef);

  const getTextMaxWidth = () => {
    let maxWidth = itemContainerSize.width;

    if (style?.paddingLeft && !isNaN(Number(style?.paddingLeft))) {
      maxWidth -= Number(style.paddingLeft);
    }

    if (menu.isHeader) {
      maxWidth -= 58;
    }
    return maxWidth;
  };

  return (
    <Tooltip
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      placement={'right'}
      content={menu.name}
      disabled={!sidebarState.sidebarCollapsed}
    >
      <FlexRow
        ref={containerRef}
        as={motion.div}
        layout
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
            overflow: 'hidden',
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
            {!sidebarState.delayedSidebarCollapsed && (
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
                  textOverflow: 'ellipsis',
                  maxWidth: getTextMaxWidth(),
                }}
              >
                {menu.name}
              </motion.span>
            )}
          </AnimatePresence>
        </FlexRow>

        {menu.isHeader && !sidebarState.delayedSidebarCollapsed && (
          <IoChevronDownOutline
            style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              transition: 'transform 0.2s ease',
              transform: depthOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
            }}
          />
        )}
      </FlexRow>
    </Tooltip>
  );
}
