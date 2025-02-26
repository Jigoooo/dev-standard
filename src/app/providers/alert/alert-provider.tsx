import { AlertDialog, SnackBar, FramerMotionNotification } from '@/shared/components';
import { useMediaQueryWidth } from '@/shared/hooks';

export function AlertProvider() {
  const mobileSizeMatches = useMediaQueryWidth(380);

  return (
    <>
      <AlertDialog />
      {mobileSizeMatches ? <SnackBar /> : <FramerMotionNotification />}
    </>
  );
}
