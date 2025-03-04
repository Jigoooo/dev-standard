import { useCallback, useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { Input, Table, THeader } from '@/shared/components';
import { testData } from '@/shared/components/table/ui/testData.ts';

const tableHeaders: THeader[] = [
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

export function Home() {
  const menuState = useMenuState();

  const [dataList, setDataList] = useState(testData);

  const handelDataList = useCallback((index: string, key: string, value: any) => {
    setDataList((prevState) => {
      return prevState.map((item) => {
        if (item.index === index) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
    });
  }, []);

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <div
        style={{
          height: '100%',
          maxHeight: 'calc(100vh - 200px)',
          maxWidth: 'calc(100vw - 300px)',
          overflow: 'hidden',
        }}
      >
        <Table
          tableHeaders={tableHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          handleSyncCheckList={(checkedList) => {
            console.log(checkedList);
          }}
          filterRowEnabled={true}
        />
      </div>
    </MainLayout>
  );
}
