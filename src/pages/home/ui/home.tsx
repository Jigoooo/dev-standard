import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexDiv, Radio, RadioGroup } from '@/shared/ui';
import { useState } from 'react';

export function Home() {
  const menuState = useMenuState();

  const [selected, setSelected] = useState('1');

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexDiv
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <RadioGroup
          name={'test'}
          selectedRadio={selected}
          handleSelectedRadio={setSelected}
          groupDisabled={true}
        >
          <Radio value={'1'} label={'1'} />
          <Radio value={'2'} label={'2'} />
        </RadioGroup>
      </FlexDiv>
    </MainLayout>
  );
}
