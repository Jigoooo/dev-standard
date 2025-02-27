import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import {
  FlexColumn,
  RootTable,
  TableHeader,
  TableBody,
  Select,
  MultiSelect,
} from '@/shared/components';
import { useState } from 'react';

export function Home() {
  const menuState = useMenuState();

  const [selected, setSelected] = useState('1');
  const [multiSelected, setMultiSelected] = useState([]);

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
        <Select
          value={selected}
          onChange={setSelected}
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
          ]}
          isAutocomplete={true}
        />
        <MultiSelect
          values={multiSelected}
          onChange={setMultiSelected}
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
          ]}
        />
        <RootTable
          isSorting={true}
          visibleCheckbox={true}
          headers={[
            {
              id: 'column1',
              label: '컬럼1',
              // width: 300,
              // fixed: false,
              // hidden: false,
              // filter: {
              //   filterable: true,
              //   filterValues: ['1', '2', '3'],
              // },
              filter: {
                filterable: false,
                filterValues: [],
              },
              sorter: {
                sortable: true,
                direction: 'asc',
              },
            },
            {
              id: 'column2',
              label: '컬럼2',
              filter: {
                filterable: false,
                filterValues: [],
              },
              sorter: {
                sortable: true,
                direction: 'asc',
              },
            },
            {
              id: 'column3',
              label: '컬럼3',
              filter: {
                filterable: false,
                filterValues: [],
              },
              sorter: {
                sortable: true,
                direction: 'asc',
              },
            },
          ]}
          dataList={[
            {
              column1: '1',
              column2: '2',
              column3: '3',
            },
            {
              column1: '2',
              column2: '3',
              column3: '1',
            },
          ]}
        >
          <TableHeader />
          <TableBody keyLabel={'column1'} />
        </RootTable>
      </FlexColumn>
    </MainLayout>
  );
}
