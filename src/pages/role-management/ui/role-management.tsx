import { useEffect, useState } from 'react';

import { Button, FlexRow, Table, TDataWithIndex, useTableData } from '@/shared/components';
import {
  RRoleUser,
  RMenuMemberAuth,
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
    if (getMemberListQuery.data?.data) {
      const dataWithIndex = getMemberListQuery.data.data.menuList.map((item, index) => ({
        ...item,
        index: (index + 1).toString(),
      }));
      setDataList(dataWithIndex);
    }
  }, [getMemberListQuery.data?.data]);
  useEffect(() => {
    if (getMenuMemberAuthListQuery.data?.data) {
      const dataWithIndex = getMenuMemberAuthListQuery.data.data.menuList.map((item, index) => ({
        ...item,
        index: (index + 1).toString(),
      }));
      setMenuAuthList(dataWithIndex);
    }
  }, [getMenuMemberAuthListQuery.data?.data]);

  const updateMenuMemberAuth = () => {
    updateMenuMemberAuthService.mutate(menuAuthList);
  };

  return (
    <div
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <Button onClick={updateMenuMemberAuth}>저장</Button>
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
    </div>
  );
}
