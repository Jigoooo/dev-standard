import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import type { RefObject } from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { MdOutlineEdit } from 'react-icons/md';
import { RxDragHandleHorizontal } from 'react-icons/rx';

import { dialog, Divider, FlexColumn, FlexRow, Input, SaveButton, Typography } from '@/shared/ui';
import type { Menu } from '@/entities/router';
import { useRouterMenuContext } from '@/entities/router';
import { handleAuthError, useGetMenusQuery, useUpdateMenuMutation } from '@/shared/api';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { colors } from '@/shared/constants';

export function MenuSetting() {
  const navigate = useNavigate();
  const { makeGroupMenus, flattenGroupMenus } = useRouterMenuContext();

  const [menuList, setMenuList] = useState<Menu[]>([]);
  const originalMenuListRef = useRef<Menu[]>([]);
  const [hoverMenuId, setHoverMenuId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const editRef = useHandleClickOutsideRef<HTMLInputElement>({
    condition: editId !== null,
    outsideClickAction: () => {
      setEditId(null);
    },
  });

  const updateOrderBy = (items: Menu[]): Menu[] => {
    return items.map((item, index) => ({
      ...item,
      orderBy: index + 1,
    }));
  };

  const reorderMenuList = (mainMenu: Menu, newChildren: Menu[]) => {
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
    const updateMenuNameInList = (menus: Menu[]): Menu[] => {
      return menus.map((menu) => {
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

  const getMenuListQuery = useGetMenusQuery();
  const updateMenuMutation = useUpdateMenuMutation();

  useEffect(() => {
    if (getMenuListQuery.data?.data?.menuList) {
      const newMenuList = getMenuListQuery.data?.data?.menuList ?? [];
      const grouped = makeGroupMenus(newMenuList);
      setMenuList(grouped);

      originalMenuListRef.current = grouped;
    }
  }, [getMenuListQuery.data?.data?.menuList]);

  const updateMenu = () => {
    updateMenuMutation.mutate(flattenGroupMenus(menuList), {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate('/', { replace: true }),
          onOtherError: () => {
            dialog.error({
              title: '메뉴 수정 실패',
              contents: data?.msg ?? '관리자에게 문의해 주세요.',
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
    dialog.info({
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

          const originalValue = findOriginalNameAndOrderBy(
            mainMenu.menuId,
            originalMenuListRef.current,
          );
          let isModified = false;
          if (originalValue) {
            const { name: originalName } = originalValue;
            isModified = originalName !== mainMenu.name;
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
                    <Typography
                      style={{
                        fontWeight: 600,
                        color: isModified ? colors.error[400] : 'inherit',
                      }}
                    >
                      {mainMenu.name}
                    </Typography>
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
                        originalMenuList={originalMenuListRef.current}
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
  originalMenuList,
}: {
  menu: Menu;
  groupRef: RefObject<HTMLDivElement | null>;
  handleMenuNameChange: (menuId: string, newName: string) => void;
  originalMenuList: Menu[];
}) {
  const controls = useDragControls();
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const editRef = useHandleClickOutsideRef<HTMLInputElement>({
    condition: isEdit,
    outsideClickAction: () => {
      setIsEdit(false);
      setIsHover(false);
    },
  });

  const findValue = findOriginalNameAndOrderBy(menu.menuId, originalMenuList);
  const originalName = findValue?.name;
  const originalOrderBy = findValue?.orderBy;
  const isModified =
    (originalName !== undefined && originalName !== menu.name) ||
    (originalOrderBy !== undefined && originalOrderBy !== menu.orderBy);

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
              setIsHover(false);
            }
          }}
        />
      ) : (
        <FlexRow
          style={{ alignItems: 'center', gap: 6 }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Typography
            style={{
              fontWeight: 500,
              fontSize: '0.9rem',
              color: isModified ? colors.error[400] : 'inherit',
            }}
          >
            {menu.name}
          </Typography>
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

function findOriginalNameAndOrderBy(
  targetMenuId: string,
  menus: Menu[],
): { name: string; orderBy: number } | undefined {
  for (const menu of menus) {
    if (menu.menuId === targetMenuId) {
      return {
        name: menu.name,
        orderBy: menu.orderBy,
      };
    }
    if (menu.children) {
      const found = findOriginalNameAndOrderBy(targetMenuId, menu.children);
      if (found !== undefined) {
        return {
          name: found.name,
          orderBy: found.orderBy,
        };
      }
    }
  }
  return undefined;
}
