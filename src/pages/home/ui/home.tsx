import { Typography } from '@mui/joy';

import { useMenuState } from '@/entities/menu';
import { MainLayout } from '@/entities/main';

export function Home() {
  const menuState = useMenuState();

  return (
    <MainLayout headerTitle={menuState.selectedMenu.name}>
      <Typography>123</Typography>
    </MainLayout>
  );
}
