import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexColumn, Table, THeader } from '@/shared/components';
import { useState } from 'react';
import { testData } from '@/shared/components/table/ui/testData.ts';

const tableHeaders: THeader[] = [
  {
    id: 'index',
    pin: 'left',
    align: 'right',
    label: '',
    width: 60,
  },
  {
    id: 'name',
    pin: 'left',
    align: 'left',
    label: '이름',
    width: 150,
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
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
];

export function Home() {
  const menuState = useMenuState();

  const [dataList] = useState(testData);

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexColumn
        style={{
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Table
          tableStyle={{ tableMaxHeight: 1000 }}
          tableHeaders={tableHeaders}
          tableDataList={dataList}
          filterRowEnabled={true}
        />
      </FlexColumn>
    </MainLayout>
  );
}
