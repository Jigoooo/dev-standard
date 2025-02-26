import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { DateFromToPicker, FlexDiv } from '@/shared/ui';

export function Home() {
  const menuState = useMenuState();

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexDiv
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <DateFromToPicker />
      </FlexDiv>
    </MainLayout>
  );
}
