import { useEffect } from 'react';

import { FiSearch } from 'react-icons/fi';

import { FlexRow, Input, Table, useTableData } from '@/shared/components';
import { generateUsers } from '@/entities/grid-example/config/test-data.ts';
import { gridExampleHeaderGroups, gridExampleHeaders } from '@/entities/grid-example';

export function GridExample() {
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
        total: 10000,
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
        maxHeight: 'calc(100vh - 180px)',
        paddingTop: 12,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingBlock: 12,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <Input
          startDecorator={<FiSearch style={{ color: '#999999', fontSize: '1.1rem' }} />}
          style={{ width: 400 }}
          placeholder={'이름'}
        />
      </FlexRow>
      <Table
        tableHeaderGroups={gridExampleHeaderGroups}
        tableHeaders={gridExampleHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </div>
  );
}
