import { Reorder, useDragControls } from 'framer-motion';
import { useEffect, useState } from 'react';

import { RxDragHandleDots2 } from 'react-icons/rx';

import {
  dialogActions,
  DialogType,
  FlexColumn,
  FlexRow,
  SaveButton,
  Typography,
} from '@/shared/ui';
import { useGetMenuListQuery, useUpdateMenuMutation } from '@/entities/menu-setting';
import { RMenu } from '@/entities/router';
import { handleAuthError } from '@/entities/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function MenuSetting() {
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState<RMenu[]>([]);

  const getMenuListQuery = useGetMenuListQuery();
  const updateMenuMutation = useUpdateMenuMutation();

  useEffect(() => {
    if (getMenuListQuery.data?.data?.menuList) {
      const newMenuList = getMenuListQuery.data?.data?.menuList ?? [];
      setMenuList(newMenuList);
    }
  }, [getMenuListQuery.data?.data?.menuList]);

  const updateMenu = () => {
    updateMenuMutation.mutate(menuList, {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate('/', { replace: true }),
          onOtherError: () => {
            dialogActions.open({
              title: '메뉴 수정 실패',
              contents: data?.msg ?? '관리자에게 문의해 주세요.',
              dialogType: DialogType.ERROR,
            });
          },
          onRefreshSuccess: () => {
            updateMenuMutation.mutate(variables, {
              onSuccess: (data) => {
                if (data.success) {
                  toast.success('메뉴 수정 성공');
                  close();
                }
              },
            });
          },
        });

        if (!isError) {
          toast.success('메뉴 수정 성공');
          close();
        }
      },
    });
  };

  const updateMenuConfirmation = () => {
    dialogActions.open({
      title: '메뉴 수정',
      contents: '메뉴를 수정하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '수정',
      onConfirm: updateMenu,
    });
  };

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
        <SaveButton onClick={updateMenuConfirmation} />
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
