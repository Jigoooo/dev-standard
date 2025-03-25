import { useEffect } from 'react';

import { FlexColumn, FlexRow, Table, TDataWithIndex, useTableData } from '@/shared/ui';
import { RRoleUser, useGetMemberListQuery } from '@/entities/router';
import { useUserManagementHeaders } from '@/entities/user-management';

export function UserManagement() {
  const { userManagementHeaders } = useUserManagementHeaders();

  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    TDataWithIndex & RRoleUser
  >([]);

  const getMemberListQuery = useGetMemberListQuery();

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

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
        gap: 6,
      }}
    >
      <FlexRow style={{ height: '100%', gap: 12 }}>
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableHeaders={userManagementHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          deleteDataList={deleteDataList}
        />
      </FlexRow>
    </FlexColumn>
  );
}
