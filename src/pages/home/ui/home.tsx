import { useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { Button, FlexRow, Select } from '@/shared/ui';
import { useModal } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  const [test, setTest] = useState(1);

  const trainerRegisterModal = useModal();

  const testModalOpen = () => {
    trainerRegisterModal.open(({ close }) => {
      return (
        <FlexRow style={{ alignItems: 'center', justifyContent: 'center' }}>
          <span onClick={close}>test</span>
        </FlexRow>
      );
    });
  };

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexRow
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <Select
          value={test}
          onChange={(value) => setTest(value)}
          options={[
            { label: '1', value: 1 },
            { label: '2', value: 2 },
          ]}
        />
        <Button onClick={testModalOpen}>test</Button>
      </FlexRow>
    </MainLayout>
  );
}
