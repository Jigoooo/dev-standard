import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexColumn, Table, THeader } from '@/shared/components';

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
    id: 'address',
    pin: 'left',
    align: 'left',
    label: '주소',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  ...Array.from({ length: 10 }, (_, index) => {
    return {
      id: `column${index}`,
      pin: 'view',
      align: 'left',
      label: `컬럼${index}`,
      width: 120,
      filter: {
        filterType: 'text',
        filterValue: '',
      },
    } as const;
  }),
  {
    id: 'phoneNumber',
    pin: 'right',
    align: 'left',
    label: '휴대폰번호',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'note',
    pin: 'right',
    align: 'left',
    label: '비고',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
];

export function Home() {
  const menuState = useMenuState();

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexColumn
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <Table tableHeaders={tableHeaders} filterRowEnabled={true} />
      </FlexColumn>
    </MainLayout>
  );
}
