import { useEffect } from 'react';

import { FlexRow, Table, useTableData } from '@/shared/components';
import { generateUsers } from '@/entities/role-management/config/test-data.ts';
import { roleManagementHeaders } from '@/entities/role-management';
import { roleUserHeaders } from '@/entities/role-management/config/header.tsx';

export function RoleManagement() {
  const { dataList, setDataList, handelDataList } = useTableData<{
    index: string;
    check: boolean;
    name: string;
    email: string;
    age: number;
    address: string;
    phone: string;
    jobTitle: string;
    department: string;
    salary: number;
    hireDate: string;
  }>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      const allUsers = [];

      for await (const batch of generateUsers({
        total: 100,
      })) {
        allUsers.push(...batch);

        if (isMounted) {
          setDataList((prev) => [...prev, ...batch]);
        }
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

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
          tableDataList={dataList}
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
