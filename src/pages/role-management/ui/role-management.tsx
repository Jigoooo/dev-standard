import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import {
  dialog,
  FlexColumn,
  FlexRow,
  SaveButton,
  Table,
  TDataWithIndex,
  useTableData,
} from '@/shared/ui';
import { useRoleManagementHeaders } from '@/entities/router';
import { useMemberState } from '@/entities/member';
import {
  handleAuthError,
  RMenuMemberAuth,
  RRoleUser,
  useGetMemberListQuery,
  useGetMenuMemberAuthListQuery,
  useUpdateMenuMemberAuthMutation,
} from '@/shared/api';
import { Router } from '@/shared/router';

export function RoleManagement() {
  const memberState = useMemberState();

  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    TDataWithIndex & RRoleUser
  >([]);
  const {
    dataList: menuAuthList,
    setDataList: setMenuAuthList,
    handelDataList: handelMenuAuthList,
    deleteDataList: deleteMenuAuthList,
  } = useTableData<TDataWithIndex & RMenuMemberAuth>([]);

  const [memberId, setMemberId] = useState('');

  const getMemberListQuery = useGetMemberListQuery();
  const getMenuMemberAuthListQuery = useGetMenuMemberAuthListQuery({
    memberId,
  });

  useEffect(() => {
    if (getMemberListQuery.data?.data?.memberList) {
      const dataWithIndex = getMemberListQuery.data.data.memberList.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });
      setDataList(dataWithIndex);
    }
  }, [getMemberListQuery.data?.data?.memberList]);

  useEffect(() => {
    if (getMenuMemberAuthListQuery.data?.data?.menuList) {
      const isOwnRole = memberState.memberId === memberId;

      const menuList = getMenuMemberAuthListQuery.data.data.menuList;

      const dataWithIndex = menuList
        .filter((menuItem) => {
          if (
            isOwnRole &&
            (menuItem.menuId === Router.MANAGER || menuItem.menuId == Router.ROLE_MANAGEMENT)
          ) {
            return false;
          }

          return true;
        })
        .map((menuItem, index) => {
          const isAllChecked =
            menuItem.useYn === 'Y' &&
            menuItem.authIns === 'Y' &&
            menuItem.authDel === 'Y' &&
            menuItem.authSearch === 'Y' &&
            menuItem.authMod === 'Y' &&
            menuItem.excelExport === 'Y';

          return {
            ...menuItem,
            index: index + 1,
            allChecked: isAllChecked,
          };
        });
      setMenuAuthList(dataWithIndex);
    }
  }, [memberState.memberId, getMenuMemberAuthListQuery.data?.data?.menuList]);

  const updateMenuMemberAuth = useUpdateMenuMemberAuth({
    menuAuthList,
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
            setMemberId(data.memberId);
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
          tableDataList={menuAuthList}
          handelDataList={handelMenuAuthList}
          deleteDataList={deleteMenuAuthList}
        />
      </FlexRow>
    </FlexColumn>
  );
}

function useUpdateMenuMemberAuth({ menuAuthList }: { menuAuthList: RMenuMemberAuth[] }) {
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
        updateMenuMemberAuthMutation.mutate(menuAuthList, {
          onSuccess: async (data, variables) => {
            const isError = await handleAuthError({
              data,
              onUnauthenticated: () => navigate('/', { replace: true }),
              onOtherError: () => {
                dialog.error({
                  title: '권한 저장에 실패하였습니다.',
                  contents: data.msg ?? '관리자에게 문의해 주세요.',
                });
              },
              onRefreshSuccess: () => {
                updateMenuMemberAuthMutation.mutate(variables, {
                  onSuccess: (data) => {
                    if (data.success) {
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
        });
      },
    });
  };
}
