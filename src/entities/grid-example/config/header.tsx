import { Input, THeader, THeaderGroup } from '@/shared/components';
import { RGridExample } from '@/entities/grid-example';

export const gridExampleHeaderGroups: THeaderGroup<RGridExample>[] = [
  {
    groupLabel: 'Personal Info',
    headerIds: ['name', 'age', 'address', 'email', 'phone'],
  },
  {
    groupLabel: 'Employment',
    headerIds: ['jobTitle', 'department', 'salary', 'hireDate'],
  },
];

export const gridExampleHeaders: THeader<RGridExample>[] = [
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
    width: 250,
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
    width: 100,
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
    width: 250,
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
    width: 250,
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
    id: 'salary',
    pin: 'view',
    align: 'left',
    label: '급여',
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
