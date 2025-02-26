import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';
import { FlexDiv } from '@/shared/ui';
import { useEffect } from 'react';
import { loadingAction } from '@/shared/components';

export function Home() {
  const menuState = useMenuState();

  useEffect(() => {
    loadingAction.showLoading({
      loadingText: 'Loading...',
    });
  }, []);

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <FlexDiv
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <div></div>
      </FlexDiv>
    </MainLayout>
  );
}
