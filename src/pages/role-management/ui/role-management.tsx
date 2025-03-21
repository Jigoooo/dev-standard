import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import {
  dialogActions,
  DialogType,
  FlexColumn,
  FlexRow,
  SaveButton,
  Table,
  TDataWithIndex,
  useTableData,
} from '@/shared/ui';
import {
  useGetMemberListQuery,
  useGetMenuMemberAuthListQuery,
  useUpdateMenuMemberAuthMutation,
  useRoleManagementHeaders,
  RMenuMemberAuth,
  RRoleUser,
  Router,
} from '@/entities/router';
import { useMemberState } from '@/entities/member';
import { handleAuthError } from '@/entities/auth';

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
    if (getMemberListQuery.data?.data?.menuList) {
      const dataWithIndex = getMemberListQuery.data.data.menuList.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });
      setDataList(dataWithIndex);
    }
  }, [getMemberListQuery.data?.data?.menuList]);

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
          gap: 6,
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
    dialogActions.open({
      title: '권한을 수정하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => {
        updateMenuMemberAuthMutation.mutate(menuAuthList, {
          onSuccess: async (data, variables) => {
            const isError = await handleAuthError({
              data,
              onUnauthenticated: () => navigate('/', { replace: true }),
              onOtherError: () => {
                dialogActions.open({
                  dialogType: DialogType.ERROR,
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
              toast.success('엑셀 등록 성공');
            }
          },
        });
      },
    });
  };
}
