import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexDiv, Radio, RadioGroup } from '@/shared/ui';
import { useState } from 'react';

export function Home() {
  const menuState = useMenuState();

  const [selectedRadio, setSelectedRadio] = useState('test');

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexDiv
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <RadioGroup
          name={'test'}
          selectedRadio={selectedRadio}
          handleSelectedRadio={setSelectedRadio}
        >
          <Radio value={'test'} label={'test'} />
          <Radio value={'test1'} label={'test1'} />
        </RadioGroup>
      </FlexDiv>
    </MainLayout>
  );
}
