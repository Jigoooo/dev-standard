import { useEffect } from 'react';

import { FlexRow, Table, TDataWithIndex, useTableData } from '@/shared/components';
import {
  RAuthMenu,
  useGetMenuMemberAuthListQuery,
  useRoleManagementHeaders,
} from '@/entities/role-management';

export function RoleManagement() {
  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList } = useTableData<TDataWithIndex & RAuthMenu>([]);

  const getMenuMemberAuthListQuery = useGetMenuMemberAuthListQuery();
  useEffect(() => {
    if (getMenuMemberAuthListQuery.data?.data) {
      const dataWithIndex = getMenuMemberAuthListQuery.data.data.menuList.map((item, index) => ({
        ...item,
        index: (index + 1).toString(),
      }));
      setDataList(dataWithIndex);
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
          tableHeaders={roleUserHeaders}
          tableDataList={[
            {
              index: '1',
              name: '',
            },
          ]}
          handelDataList={handelDataList}
          handleSyncCheckList={(checkedList) => {
            console.log(checkedList);
          }}
        />
        <Table
          tableHeaders={roleManagementHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          handleSyncCheckList={(checkedList) => {
            console.log(checkedList);
          }}
        />
      </FlexRow>
    </div>
  );
}
