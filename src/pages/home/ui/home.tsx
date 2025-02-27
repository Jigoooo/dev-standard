import { useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { MultiSelect, FlexColumn } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  const [test, setTest] = useState(['11111']);

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
        <MultiSelect
          values={test}
          onChange={(values) => setTest(values)}
          options={[
            { label: '1', value: '11111' },
            { label: '2', value: '22222' },
            { label: '3', value: '33333' },
            { label: '4', value: '44444' },
            { label: '5', value: '55555' },
          ]}
        />
      </FlexColumn>
    </MainLayout>
  );
}
