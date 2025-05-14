import { useEffect } from 'react';

import type { DataWithIndex } from '@/shared/ui';
import { FlexColumn, FlexRow, Table, useTableData } from '@/shared/ui';
import type { RoleUserResponse } from '@/shared/api';
import { useGetMemberListQuery } from '@/shared/api';
import { useMemberManagementHeaders } from '@/entities/member';

export function UserManagement() {
  const { userManagementHeaders } = useMemberManagementHeaders();

  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    DataWithIndex & RoleUserResponse
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
