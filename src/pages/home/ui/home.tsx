import { useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { Select, FlexColumn, DatePicker, DateFromToPicker } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  const [test, setTest] = useState(1);

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
        <DatePicker isInputMode={true} />
        <DateFromToPicker />
        <Select
          label={'드롭다운'}
          value={test}
          onChange={(value) => setTest(value)}
          options={[
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
          ]}
        />
      </FlexColumn>
    </MainLayout>
  );
}
