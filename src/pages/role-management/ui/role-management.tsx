import { useEffect, useState } from 'react';

import {
  Button,
  dialogActions,
  DialogType,
  FlexColumn,
  FlexRow,
  Table,
  TDataWithIndex,
  useTableData,
} from '@/shared/components';
import {
  RMenuMemberAuth,
  RRoleUser,
  useGetMemberListApi,
  useGetMenuMemberAuthListQuery,
  useRoleManagementHeaders,
} from '@/entities/role-management';
import { useUpdateMenuMemberAuthService } from '@/entities/role-management/api/role-management-service.ts';
import { useRouterMenuContext } from '@/entities/router';

export function RoleManagement() {
  const { currentMenuMemberAuth } = useRouterMenuContext();
  console.log(currentMenuMemberAuth);

  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList } = useTableData<TDataWithIndex & RRoleUser>([]);
  const {
    dataList: menuAuthList,
    setDataList: setMenuAuthList,
    handelDataList: handelMenuAuthList,
  } = useTableData<TDataWithIndex & RMenuMemberAuth>([]);

  const [memberId, setMemberId] = useState('');

  const getMemberListQuery = useGetMemberListApi();
  const getMenuMemberAuthListQuery = useGetMenuMemberAuthListQuery({
    memberId,
  });
  const updateMenuMemberAuthService = useUpdateMenuMemberAuthService();

  useEffect(() => {
    if (getMemberListQuery.data?.data?.menuList) {
      const dataWithIndex = getMemberListQuery.data.data.menuList.map((item, index) => ({
        ...item,
        index: (index + 1).toString(),
      }));
      setDataList(dataWithIndex);
    }
  }, [getMemberListQuery.data?.data?.menuList]);
  useEffect(() => {
    if (getMenuMemberAuthListQuery.data?.data?.menuList) {
      const dataWithIndex = getMenuMemberAuthListQuery.data.data.menuList.map((item, index) => ({
        ...item,
        index: (index + 1).toString(),
      }));
      setMenuAuthList(dataWithIndex);
    }
  }, [getMenuMemberAuthListQuery.data?.data?.menuList]);

  const updateMenuMemberAuth = () => {
    updateMenuMemberAuthService.mutate(menuAuthList, {
      onSuccess: (data) => {
        if (!data.success) {
          dialogActions.openDialog({
            dialogType: DialogType.ERROR,
            title: '권한 저장에 실패하였습니다.',
            contents: data.msg ?? '관리자에게 문의해 주세요.',
          });
        }
      },
    });
  };

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <FlexRow style={{ justifyContent: 'flex-end' }}>
        <Button onClick={updateMenuMemberAuth}>저장</Button>
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
        />
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableHeaders={roleManagementHeaders}
          filterRowEnabled={false}
          tableDataList={menuAuthList}
          handelDataList={handelMenuAuthList}
        />
      </FlexRow>
    </FlexColumn>
  );
}
