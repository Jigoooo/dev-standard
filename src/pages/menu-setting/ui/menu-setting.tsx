import { Reorder, useDragControls } from 'framer-motion';
import { useEffect, useState } from 'react';

import { RxDragHandleDots2 } from 'react-icons/rx';

import { FlexColumn, FlexRow, SaveButton, Typography } from '@/shared/ui';
import { useGetMenuListQuery } from '@/entities/menu-setting';
import { RMenu } from '@/entities/router';

export function MenuSetting() {
  const [menuList, setMenuList] = useState<RMenu[]>([]);

  const getMenuListQuery = useGetMenuListQuery();

  useEffect(() => {
    if (getMenuListQuery.data?.data?.menuList) {
      const newMenuList = getMenuListQuery.data?.data?.menuList ?? [];
      setMenuList(newMenuList);
    }
  }, [getMenuListQuery.data?.data?.menuList]);

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
        gap: 6,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 6,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          height: 65,
        }}
      >
        <SaveButton onClick={() => {}} />
      </FlexRow>

      <Reorder.Group
        axis='y'
        values={menuList}
        onReorder={setMenuList}
        layoutScroll
        style={{
          userSelect: 'none',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          maxHeight: 'calc(100vh - 300px)',
          width: '50%',
        }}
      >
        {menuList.map((menu) => (
          <ReorderItem key={menu.menuId} menu={menu} />
        ))}
      </Reorder.Group>
    </FlexColumn>
  );
}

function ReorderItem({ menu }: { menu: RMenu }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={menu}
      dragListener={false}
      dragControls={controls}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingInline: 12,
        paddingBlock: 12,
        gap: 4,
      }}
    >
      <Typography>{menu.menuTitle}</Typography>
      <FlexRow onPointerDown={(e) => controls.start(e)} style={{ cursor: 'grab' }}>
        <RxDragHandleDots2 />
      </FlexRow>
    </Reorder.Item>
  );
}
