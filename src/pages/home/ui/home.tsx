import { useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { MultiSelect, FlexColumn, Select } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  const [test, setTest] = useState(['11111']);
  const [selectValue, setSelectValue] = useState('1');

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
          value={selectValue}
          options={[
            { label: '11111', value: '1' },
            { label: '22222', value: '2' },
          ]}
          onChange={setSelectValue}
        />
        <MultiSelect
          label={'멀티셀렉트 테스트'}
          values={test}
          containerWidth={300}
          onChange={(values) => setTest(values)}
          options={[
            { label: '11111', value: '1' },
            { label: '22222', value: '2' },
            { label: '33333', value: '3' },
            { label: '44444', value: '4' },
            { label: '55555', value: '5' },
          ]}
        />
      </FlexColumn>
    </MainLayout>
  );
}
