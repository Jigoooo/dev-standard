import { useState } from 'react';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexRow, Select, Button, useModal, ModalLayout } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  const [test, setTest] = useState(1);

  const trainerRegisterModal = useModal();

  const testModalOpen = () => {
    trainerRegisterModal.open(({ close }) => {
      return (
        <ModalLayout title={'테스트모달'} close={close}>
          <FlexRow style={{ flexWrap: 'nowrap' }}>
            <div style={{ whiteSpace: 'nowrap' }}>
              테스트테스트테스트테스트테스트테스트테스트테스트테스트
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              테스트테스트테스트테스트테스트테스트테스트테스트테스트
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              테스트테스트테스트테스트테스트테스트테스트테스트테스트
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              테스트테스트테스트테스트테스트테스트테스트테스트테스트
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              테스트테스트테스트테스트테스트테스트테스트테스트테스트
            </div>
          </FlexRow>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
          <span>테스트</span>
        </ModalLayout>
      );
    });
  };

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexRow
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
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
        <Button onClick={testModalOpen}>test</Button>
      </FlexRow>
    </MainLayout>
  );
}
