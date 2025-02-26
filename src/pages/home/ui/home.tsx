import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexDiv, Switch } from '@/shared/ui';
import { useToggle } from '@/shared/hooks';

export function Home() {
  const menuState = useMenuState();

  const [test, toggle] = useToggle();

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexDiv
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <Switch label={'test'} isOn={test} onClick={toggle} disabled={true} />
      </FlexDiv>
    </MainLayout>
  );
}
