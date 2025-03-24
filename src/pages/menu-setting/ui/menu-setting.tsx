import { Reorder, useDragControls } from 'framer-motion';
import { createRef, RefObject, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { RxDragHandleHorizontal } from 'react-icons/rx';

import {
  dialogActions,
  DialogType,
  Divider,
  FlexColumn,
  FlexRow,
  SaveButton,
  Typography,
} from '@/shared/ui';
import { useGetMenuListQuery, useUpdateMenuMutation } from '@/entities/menu-setting';
import { TMenu, useRouterMenuContext } from '@/entities/router';
import { handleAuthError } from '@/entities/auth';

export function MenuSetting() {
  const navigate = useNavigate();
  const { makeGroupMenus, flattenGroupMenus } = useRouterMenuContext();

  const [menuList, setMenuList] = useState<TMenu[]>([]);

  const updateOrderBy = (items: TMenu[]): TMenu[] => {
    return items.map((item, index) => ({
      ...item,
      orderBy: index + 1,
    }));
  };

  const reorderMenuList = (mainMenu: TMenu, newChildren: TMenu[]) => {
    const updatedChildren = updateOrderBy(newChildren);

    setMenuList((prevMenuList) => {
      const updatedList = [...prevMenuList];
      updatedList[mainMenu.menuIndex] = {
        ...updatedList[mainMenu.menuIndex],
        children: updatedChildren,
      };
      return updatedList;
    });
  };

  const getMenuListQuery = useGetMenuListQuery();
  const updateMenuMutation = useUpdateMenuMutation();

  useEffect(() => {
    if (getMenuListQuery.data?.data?.menuList) {
      const newMenuList = getMenuListQuery.data?.data?.menuList ?? [];
      setMenuList(makeGroupMenus(newMenuList));
    }
  }, [getMenuListQuery.data?.data?.menuList]);

  const updateMenu = () => {
    updateMenuMutation.mutate(flattenGroupMenus(menuList), {
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

  const groupRefs = useRef<Record<number, RefObject<HTMLDivElement | null>>>({});

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
          width: '50%',
          paddingTop: 24,
          paddingBottom: 6,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          height: 65,
        }}
      >
        <SaveButton onClick={updateMenuConfirmation} />
      </FlexRow>

      <FlexColumn
        style={{
          userSelect: 'none',
          overflowY: 'auto',
          border: '1px solid #dedede',
          borderRadius: 8,
          maxHeight: 'calc(100vh - 300px)',
          width: '50%',
          paddingBlock: 24,
          gap: 16,
        }}
      >
        {menuList.map((mainMenu) => {
          if (!groupRefs.current[mainMenu.menuIndex]) {
            groupRefs.current[mainMenu.menuIndex] = createRef<HTMLDivElement>();
          }

          return (
            <FlexColumn key={mainMenu.menuIndex} style={{ paddingInline: 20, gap: 6 }}>
              <Typography style={{ fontWeight: 600 }}>{mainMenu.name}</Typography>
              <Divider />
              {mainMenu.children && (
                <Reorder.Group
                  ref={groupRefs.current[mainMenu.menuIndex]}
                  values={mainMenu.children}
                  onReorder={(newChildren) => {
                    reorderMenuList(mainMenu, newChildren);
                  }}
                >
                  {mainMenu.children.map((submenu) => {
                    return (
                      <ReorderItem
                        key={submenu.menuIndex}
                        groupRef={groupRefs.current[mainMenu.menuIndex]}
                        menu={submenu}
                      />
                    );
                  })}
                </Reorder.Group>
              )}
            </FlexColumn>
          );
        })}
      </FlexColumn>
    </FlexColumn>
  );
}

function ReorderItem({
  menu,
  groupRef,
}: {
  menu: TMenu;
  groupRef: RefObject<HTMLDivElement | null>;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={menu}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingInline: 16,
        paddingBlock: 8,
      }}
    >
      <Typography style={{ fontWeight: 500, fontSize: '0.9rem' }}>{menu.name}</Typography>
      <FlexRow onPointerDown={(e) => controls.start(e)} style={{ cursor: 'grab' }}>
        <RxDragHandleHorizontal style={{ fontSize: '1.4rem' }} />
      </FlexRow>
    </Reorder.Item>
  );
}
