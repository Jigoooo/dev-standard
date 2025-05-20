import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import type { DataWithIndex } from '@/shared/ui';
import { dialog, FlexColumn, FlexRow, SaveButton, Table, useTableData } from '@/shared/ui';
import { useRoleManagementHeaders } from '@/entities/router';
import type { MenuMemberAuthType } from '@/entities/member';
import { useMeState } from '@/entities/member';
import type { MenuMemberAuthResponse, RoleUserResponse } from '@/shared/api';
import {
  handleAuthError,
  useGetMembersQuery,
  useGetMenuMemberAuthsQuery,
  useUpdateMenuMemberAuthMutation,
} from '@/shared/api';
import { Router } from '@/shared/router';

export function RoleManagement() {
  const memberState = useMeState();

  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    DataWithIndex & RoleUserResponse
  >([]);
  const {
    dataList: menuAuths,
    setDataList: setMenuAuths,
    handelDataList: handelMenuAuths,
    deleteDataList: deleteMenuAuths,
  } = useTableData<DataWithIndex & MenuMemberAuthType>([]);

  const [memberId, setMemberId] = useState('');

  const getMembersQuery = useGetMembersQuery();
  const getMenuMemberAuthsQuery = useGetMenuMemberAuthsQuery({
    memberId,
  });

  useEffect(() => {
    if (getMembersQuery.data?.data) {
      const dataWithIndex = getMembersQuery.data.data.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });
      setDataList(dataWithIndex);
    }
  }, [getMembersQuery.data?.data, setDataList]);

  useEffect(() => {
    if (getMenuMemberAuthsQuery.data?.data) {
      const isOwnRole = memberState.id === memberId;

      const menuAuths = getMenuMemberAuthsQuery.data.data;

      const dataWithIndex = menuAuths
        .filter((menuItem) => {
          if (
            isOwnRole &&
            (menuItem.menuId === Router.MANAGER || menuItem.menuId == Router.ROLE_MANAGEMENT)
          ) {
            return false;
          }

          return true;
        })
        .map((menuAuth, index) => {
          const isAllChecked =
            menuAuth.canUse &&
            menuAuth.canInsert &&
            menuAuth.canDelete &&
            menuAuth.canSearch &&
            menuAuth.canModify &&
            menuAuth.canExport;

          return {
            ...menuAuth,
            index: index + 1,
            allChecked: isAllChecked,
          };
        });

      setMenuAuths(dataWithIndex);
    }
  }, [memberState.id, getMenuMemberAuthsQuery.data?.data, memberId, setMenuAuths]);

  const updateMenuMemberAuth = useUpdateMenuMemberAuth({
    memberId,
    menuAuths,
  });

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
          gap: 4,
          height: 65,
        }}
      >
        {memberId !== '' && <SaveButton onClick={updateMenuMemberAuth} />}
      </FlexRow>

      <FlexRow style={{ height: '100%', gap: 12 }}>
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableRowClick={(data) => {
            setMemberId(data.id);
          }}
          tableHeaders={roleUserHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          deleteDataList={deleteDataList}
        />
        <Table
          tableStyle={{
            showVerticalLines: true,
            tableContainerAutoWidth: true,
          }}
          tableHeaders={roleManagementHeaders}
          filterRowEnabled={false}
          tableDataList={menuAuths}
          handelDataList={handelMenuAuths}
          deleteDataList={deleteMenuAuths}
        />
      </FlexRow>
    </FlexColumn>
  );
}

function useUpdateMenuMemberAuth({
  memberId,
  menuAuths,
}: {
  memberId: string;
  menuAuths: MenuMemberAuthResponse[];
}) {
  const navigate = useNavigate();

  const updateMenuMemberAuthMutation = useUpdateMenuMemberAuthMutation();

  return () => {
    dialog.info({
      title: '권한을 수정하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '수정',
      onConfirm: () => {
        updateMenuMemberAuthMutation.mutate(
          {
            pathVariable: {
              memberId,
            },
            data: menuAuths,
          },
          {
            onSuccess: async (data, variables) => {
              const isError = await handleAuthError({
                data,
                onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
                onOtherError: () => {
                  dialog.error({
                    title: '권한 저장에 실패하였습니다.',
                    contents: data.message ?? '관리자에게 문의해 주세요.',
                  });
                },
                onRefreshSuccess: () => {
                  updateMenuMemberAuthMutation.mutate(variables, {
                    onSuccess: (data) => {
                      if (data.isSuccess) {
                        toast.success('권한이 수정되었습니다.');
                      }
                    },
                  });
                },
              });

              if (!isError) {
                toast.success('권한 수정 성공');
              }
            },
          },
        );
      },
    });
  };
}
