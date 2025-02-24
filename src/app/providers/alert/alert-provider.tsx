import { AlertDialog, SnackBar, FramerMotionNotification } from '@/shared/components';
import { useSizeMatch } from '@/shared/hooks';

export function AlertProvider() {
  const mobileSizeMatches = useSizeMatch('sm');

  return (
    <>
      <AlertDialog />
      {mobileSizeMatches ? <SnackBar /> : <FramerMotionNotification />}
    </>
  );
}
