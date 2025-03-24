import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { createRef, RefObject, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { MdOutlineEdit } from 'react-icons/md';
import { RxDragHandleHorizontal } from 'react-icons/rx';

import {
  dialogActions,
  DialogType,
  Divider,
  FlexColumn,
  FlexRow,
  Input,
  SaveButton,
  Typography,
} from '@/shared/ui';
import { useGetMenuListQuery, useUpdateMenuMutation } from '@/entities/menu-setting';
import { TMenu, useRouterMenuContext } from '@/entities/router';
import { handleAuthError } from '@/entities/auth';
import { useHandleClickOutsideRef } from '@/shared/hooks';

export function MenuSetting() {
  const navigate = useNavigate();
  const { makeGroupMenus, flattenGroupMenus } = useRouterMenuContext();

  const [menuList, setMenuList] = useState<TMenu[]>([]);
  const [hoverMenuId, setHoverMenuId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const editRef = useHandleClickOutsideRef<HTMLInputElement>({
    condition: editId !== null,
    outsideClickAction: () => {
      setEditId(null);
    },
  });

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

  const handleMenuNameChange = (targetMenuId: string, newName: string) => {
    const updateMenuNameInList = (menus: TMenu[]): TMenu[] => {
      return menus.map((menu) => {
        console.log(menu.menuIndex);
        console.log(targetMenuId);
        if (menu.menuId === targetMenuId) {
          return { ...menu, name: newName };
        }

        if (menu.children) {
          return { ...menu, children: updateMenuNameInList(menu.children) };
        }
        return menu;
      });
    };

    setMenuList((prevMenuList) => updateMenuNameInList(prevMenuList));
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
      {menuList.length > 0 && (
        <FlexRow
          style={{
            width: '50%',
            paddingTop: 24,
            paddingBottom: 4,
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            height: 65,
          }}
        >
          <SaveButton onClick={updateMenuConfirmation} />
        </FlexRow>
      )}

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
            <FlexColumn key={mainMenu.menuId} style={{ paddingInline: 20, gap: 8 }}>
              <div style={{ height: 26 }}>
                {editId === mainMenu.menuId ? (
                  <Input
                    ref={editRef}
                    value={mainMenu.name}
                    onChange={(event) => {
                      handleMenuNameChange(mainMenu.menuId, event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setEditId(null);
                      }
                    }}
                  />
                ) : (
                  <FlexRow
                    style={{ alignItems: 'center', gap: 6 }}
                    onMouseEnter={() => setHoverMenuId(mainMenu.menuId)}
                    onMouseLeave={() => setHoverMenuId(null)}
                  >
                    <Typography style={{ fontWeight: 600 }}>{mainMenu.name}</Typography>
                    <AnimatePresence initial={false}>
                      {hoverMenuId === mainMenu.menuId && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <MdOutlineEdit
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setEditId(mainMenu.menuId);
                              setTimeout(() => {
                                if (editRef.current) {
                                  editRef.current.focus();
                                }
                              }, 0);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FlexRow>
                )}
              </div>

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
                        key={submenu.menuId}
                        groupRef={groupRefs.current[mainMenu.menuIndex]}
                        menu={submenu}
                        handleMenuNameChange={handleMenuNameChange}
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
  handleMenuNameChange,
}: {
  menu: TMenu;
  groupRef: RefObject<HTMLDivElement | null>;
  handleMenuNameChange: (menuId: string, newName: string) => void;
}) {
  const controls = useDragControls();
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const editRef = useHandleClickOutsideRef<HTMLInputElement>({
    condition: isEdit,
    outsideClickAction: () => {
      setIsEdit(false);
    },
  });

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
        paddingBlock: 4,
        height: 40,
      }}
    >
      {isEdit ? (
        <Input
          ref={editRef}
          value={menu.name}
          onChange={(event) => {
            handleMenuNameChange(menu.menuId, event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setIsEdit(false);
            }
          }}
        />
      ) : (
        <FlexRow
          style={{ alignItems: 'center', gap: 6 }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Typography style={{ fontWeight: 500, fontSize: '0.9rem' }}>{menu.name}</Typography>
          <AnimatePresence initial={false}>
            {isHover && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <MdOutlineEdit
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setIsEdit(true);
                    setTimeout(() => {
                      if (editRef.current) {
                        editRef.current.focus();
                      }
                    }, 0);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </FlexRow>
      )}
      <FlexRow onPointerDown={(e) => controls.start(e)} style={{ cursor: 'grab' }}>
        <RxDragHandleHorizontal style={{ fontSize: '1.4rem' }} />
      </FlexRow>
    </Reorder.Item>
  );
}
