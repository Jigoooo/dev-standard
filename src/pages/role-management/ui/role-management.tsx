import { useEffect } from 'react';

import { Input, Table, THeader, THeaderGroup, useTableData } from '@/shared/components';
import { generateUsers } from '@/shared/components/table/model/testData.ts';
import { RRoleManagement } from '@/entities/role-management';

const headerGroups: THeaderGroup<RRoleManagement>[] = [
  {
    groupLabel: 'Personal Info',
    headerIds: ['name', 'age', 'email', 'phone'],
  },
  {
    groupLabel: 'Employment',
    headerIds: ['jobTitle', 'department', 'salary', 'hireDate'],
  },
];

const tableHeaders: THeader<RRoleManagement>[] = [
  {
    id: 'index',
    pin: 'left',
    align: 'right',
    label: '',
    width: 60,
    sorter: {
      sortable: false,
    },
  },
  {
    id: 'check',
    pin: 'left',
    align: 'center',
    label: '',
    width: 60,
    sorter: {
      sortable: false,
    },
  },
  {
    id: 'name',
    pin: 'left',
    align: 'left',
    label: '이름',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'email',
    pin: 'view',
    align: 'left',
    label: '이메일',
    width: 220,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'age',
    pin: 'view',
    align: 'left',
    label: '나이',
    width: 200,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'address',
    pin: 'view',
    align: 'left',
    label: '주소',
    width: 300,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'phone',
    pin: 'view',
    align: 'left',
    label: '휴대폰번호',
    width: 150,
    cell: ({ cellData, setCellData }) => {
      return (
        <Input
          style={{ width: '100%', height: 30 }}
          value={cellData}
          onChange={(event) => setCellData(event.target.value)}
          isFocusEffect={false}
        />
      );
    },
    sorter: {
      sortable: false,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'jobTitle',
    pin: 'view',
    align: 'left',
    label: '직업',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'department',
    pin: 'view',
    align: 'left',
    label: '부서',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'salary',
    pin: 'view',
    align: 'left',
    label: '급여',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'hireDate',
    pin: 'right',
    align: 'left',
    label: '고용일',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
];

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
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <Table
        tableHeaderGroups={headerGroups}
        tableHeaders={tableHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </div>
  );
}
