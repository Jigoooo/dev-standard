import { useEffect } from 'react';

import { FlexRow, Table, TDataWithIndex, useTableData } from '@/shared/components';
import {
  RRoleUser,
  RAuthMenu,
  useGetMemberListApi,
  useGetMenuMemberAuthListQuery,
  useRoleManagementHeaders,
} from '@/entities/role-management';

export function RoleManagement() {
  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList } = useTableData<TDataWithIndex & RRoleUser>([]);
  const {
    dataList: menuAuthList,
    setDataList: setMenuAuthList,
    handelDataList: handelMenuAuthList,
  } = useTableData<TDataWithIndex & RAuthMenu>([]);

  const getMemberListQuery = useGetMemberListApi();
  const getMenuMemberAuthListQuery = useGetMenuMemberAuthListQuery({
    memberId: '',
  });

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

  return (
    <div
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <FlexRow style={{ height: '100%', gap: 12 }}>
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableRowClick={(index) => {
            console.log(index);
          }}
          tableHeaders={roleUserHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          handleSyncCheckList={(checkedList) => {
            console.log(checkedList);
          }}
        />
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableHeaders={roleManagementHeaders}
          filterRowEnabled={false}
          tableDataList={menuAuthList}
          handelDataList={handelMenuAuthList}
          handleSyncCheckList={(checkedList) => {
            console.log(checkedList);
          }}
        />
      </FlexRow>
    </div>
  );
}
