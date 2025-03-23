import { Reorder, useDragControls } from 'framer-motion';
import { useState } from 'react';

import { RxDragHandleDots2 } from 'react-icons/rx';

import { FlexColumn, FlexRow, SaveButton, Typography } from '@/shared/ui';

export function MenuSetting() {
  const [items, setItems] = useState([0, 1, 2, 3]);

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
        values={items}
        onReorder={setItems}
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
        {items.map((item) => (
          <ReorderItem key={item} item={item} />
        ))}
      </Reorder.Group>
    </FlexColumn>
  );
}

function ReorderItem({ item }: { item: any }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={item}
      value={item}
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
      <Typography>{item}</Typography>
      <FlexRow onPointerDown={(e) => controls.start(e)} style={{ cursor: 'grab' }}>
        <RxDragHandleDots2 />
      </FlexRow>
    </Reorder.Item>
  );
}
