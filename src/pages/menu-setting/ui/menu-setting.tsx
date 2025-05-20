import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import type { RefObject } from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { MdOutlineEdit } from 'react-icons/md';
import { RxDragHandleHorizontal } from 'react-icons/rx';

import { dialog, Divider, FlexColumn, FlexRow, Input, SaveButton, Typography } from '@/shared/ui';
import type { Menu } from '@/entities/router';
import { useRouterMenuContext } from '@/entities/router';
import { handleAuthError, useGetMemberMenusQuery, useUpdateMemberMenuMutation } from '@/shared/api';
import { useHandleClickOutsideRef } from '@/shared/hooks';
import { colors } from '@/shared/constants';
import { Router } from '@/shared/router';

export function MenuSetting() {
  const navigate = useNavigate();
  const { responseMenusToMenus, menusToResponseMenus } = useRouterMenuContext();

  const [menus, setMenus] = useState<Menu[]>([]);
  const originalMenusRef = useRef<Menu[]>([]);
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
      orderBy: index,
    }));
  };

  const reorderMenuList = (mainMenuId: Router, newChildren: Menu[]) => {
    const updatedChildren = updateOrderBy(newChildren);

    setMenus((prevState) => {
      return prevState.map((menu) => {
        if (menu.id === mainMenuId) {
          return {
            ...menu,
            children: updatedChildren,
          };
        }

        return menu;
      });
    });
  };

  const handleMenuTitleChange = (targetMenuId: string, newTitle: string) => {
    const updateMenuTitleInList = (menus: Menu[]): Menu[] => {
      return menus.map((menu) => {
        if (menu.id === targetMenuId) {
          return { ...menu, title: newTitle };
        }

        if (menu.children) {
          return { ...menu, children: updateMenuTitleInList(menu.children) };
        }
        return menu;
      });
    };

    setMenus((prevMenuList) => updateMenuTitleInList(prevMenuList));
  };

  const getMenuListQuery = useGetMemberMenusQuery();
  const updateMemberMenuMutation = useUpdateMemberMenuMutation();

  useEffect(() => {
    if (getMenuListQuery.data?.data) {
      const newMenuList = getMenuListQuery.data?.data ?? [];
      const grouped = responseMenusToMenus(newMenuList);
      setMenus(grouped);

      originalMenusRef.current = grouped;
    }
  }, [getMenuListQuery.data?.data, responseMenusToMenus]);

  const updateMenu = () => {
    updateMemberMenuMutation.mutate(menusToResponseMenus(menus), {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
          onOtherError: () => {
            dialog.error({
              title: '메뉴 수정 실패',
              contents: data?.message ?? '관리자에게 문의해 주세요.',
            });
          },
          onRefreshSuccess: () => {
            updateMemberMenuMutation.mutate(variables, {
              onSuccess: (data) => {
                if (data.isSuccess) {
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

  const groupRefs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({});

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
      {menus.length > 0 && (
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
        {menus.map((mainMenu) => {
          if (!groupRefs.current[mainMenu.id]) {
            groupRefs.current[mainMenu.id] = createRef<HTMLDivElement>();
          }

          const originalValue = findOriginalTitleAndOrderBy(mainMenu.id, originalMenusRef.current);
          let isModified = false;
          if (originalValue) {
            const { title: originalTitle } = originalValue;
            isModified = originalTitle !== mainMenu.title;
          }

          return (
            <FlexColumn key={mainMenu.id} style={{ paddingInline: 20, gap: 8 }}>
              <div style={{ height: 26 }}>
                {editId === mainMenu.id ? (
                  <Input
                    ref={editRef}
                    value={mainMenu.title}
                    onChange={(event) => {
                      handleMenuTitleChange(mainMenu.id, event.target.value);
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
                    onMouseEnter={() => setHoverMenuId(mainMenu.id)}
                    onMouseLeave={() => setHoverMenuId(null)}
                  >
                    <Typography
                      style={{
                        fontWeight: 600,
                        color: isModified ? colors.error[400] : 'inherit',
                      }}
                    >
                      {mainMenu.title}
                    </Typography>
                    <AnimatePresence initial={false}>
                      {hoverMenuId === mainMenu.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <MdOutlineEdit
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setEditId(mainMenu.id);
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
                  ref={groupRefs.current[mainMenu.id]}
                  values={mainMenu.children}
                  onReorder={(newChildren) => {
                    reorderMenuList(mainMenu.id, newChildren);
                  }}
                >
                  {mainMenu.children.map((submenu) => {
                    return (
                      <ReorderItem
                        key={submenu.id}
                        groupRef={groupRefs.current[mainMenu.id]}
                        menu={submenu}
                        handleMenuTitleChange={handleMenuTitleChange}
                        originalMenuList={originalMenusRef.current}
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
  handleMenuTitleChange,
  originalMenuList,
}: {
  menu: Menu;
  groupRef: RefObject<HTMLDivElement | null>;
  handleMenuTitleChange: (menuId: string, newTitle: string) => void;
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

  const findValue = findOriginalTitleAndOrderBy(menu.id, originalMenuList);
  const originalTitle = findValue?.title;
  const originalOrderBy = findValue?.orderBy;
  const isModified =
    (originalTitle !== undefined && originalTitle !== menu.title) ||
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
          value={menu.title}
          onChange={(event) => {
            handleMenuTitleChange(menu.id, event.target.value);
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
            {menu.title}
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

function findOriginalTitleAndOrderBy(
  targetMenuId: string,
  menus: Menu[],
): Pick<Menu, 'title' | 'orderBy'> | undefined {
  for (const menu of menus) {
    if (menu.id === targetMenuId) {
      return {
        title: menu.title,
        orderBy: menu.orderBy,
      };
    }
    if (menu.children) {
      const found = findOriginalTitleAndOrderBy(targetMenuId, menu.children);
      if (found !== undefined) {
        return {
          title: found.title,
          orderBy: found.orderBy,
        };
      }
    }
  }
  return undefined;
}
