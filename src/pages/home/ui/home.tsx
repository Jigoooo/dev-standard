import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexColumn, Table, THeader } from '@/shared/components';

const tableHeaders: THeader[] = [
  {
    id: 'index',
    pin: 'left',
    label: '',
    width: 60,
  },
  {
    id: 'name',
    pin: 'left',
    label: 'Name',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'address',
    pin: 'left',
    label: 'Address',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    id: `column${index}`,
    pin: 'view' as const,
    label: `column${index}`,
    width: 120,
    filter: {
      filterType: 'text',
      filterValue: '',
    } as const,
  })),
  {
    id: 'phoneNumber',
    pin: 'right',
    label: 'Phone',
    width: 150,
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'note',
    pin: 'right',
    label: 'Note',
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
        {/*<RootTable*/}
        {/*  isSorting={true}*/}
        {/*  visibleCheckbox={true}*/}
        {/*  headers={[*/}
        {/*    {*/}
        {/*      id: 'column1',*/}
        {/*      label: '컬럼1',*/}
        {/*      // width: 300,*/}
        {/*      // fixed: false,*/}
        {/*      // hidden: false,*/}
        {/*      // filter: {*/}
        {/*      //   filterable: true,*/}
        {/*      //   filterValues: ['1', '2', '3'],*/}
        {/*      // },*/}
        {/*      filter: {*/}
        {/*        filterable: false,*/}
        {/*        filterValues: [],*/}
        {/*      },*/}
        {/*      sorter: {*/}
        {/*        sortable: true,*/}
        {/*        direction: 'asc',*/}
        {/*      },*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'column2',*/}
        {/*      label: '컬럼2',*/}
        {/*      filter: {*/}
        {/*        filterable: false,*/}
        {/*        filterValues: [],*/}
        {/*      },*/}
        {/*      sorter: {*/}
        {/*        sortable: true,*/}
        {/*        direction: 'asc',*/}
        {/*      },*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'column3',*/}
        {/*      label: '컬럼3',*/}
        {/*      filter: {*/}
        {/*        filterable: false,*/}
        {/*        filterValues: [],*/}
        {/*      },*/}
        {/*      sorter: {*/}
        {/*        sortable: true,*/}
        {/*        direction: 'asc',*/}
        {/*      },*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  dataList={[*/}
        {/*    {*/}
        {/*      column1: '1',*/}
        {/*      column2: '2',*/}
        {/*      column3: '3',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      column1: '2',*/}
        {/*      column2: '3',*/}
        {/*      column3: '1',*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <TableHeaderLegacy />*/}
        {/*  <TableBodyLegacy keyLabel={'column1'} />*/}
        {/*</RootTable>*/}
      </FlexColumn>
    </MainLayout>
  );
}
