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
        <DateFromToPicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-03-10')} />
      </FlexDiv>
    </MainLayout>
  );
}
