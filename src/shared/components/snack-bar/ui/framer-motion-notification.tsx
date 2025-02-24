import { Stack, Box } from '@mui/joy';
import { AnimatePresence, motion } from 'framer-motion';
import Typography from '@mui/joy/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { OverridableStringUnion } from '@mui/types';
import { ColorPaletteProp } from '@mui/joy/styles/types';
import { SnackbarPropsColorOverrides } from '@mui/joy/Snackbar/SnackbarProps';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { SNACK_BAR_Z_INDEX, colors } from '@/shared/constants';
import { IconButton } from '@/shared/ui';
import { hideDesktopSnackBar, useNotificationInfos } from '@/shared/components/snack-bar';

export function FramerMotionNotification() {
  const notifications = useNotificationInfos();

  return (
    <Stack>
      <ul
        style={{
          zIndex: SNACK_BAR_Z_INDEX,
          pointerEvents: 'none',
          padding: 0,
          margin: 0,
          position: 'fixed',
          display: 'flex',
          bottom: 0,
          right: 0,
          top: 0,
          flexDirection: 'column',
          listStyle: 'none',
          justifyContent: 'flex-end',
          height: 'auto',
        }}
      >
        <AnimatePresence initial={false}>
          {notifications.map((notification) => {
            const notificationTheme = getNotificationTheme(notification.color);

            return (
              <motion.li
                key={notification.idx}
                // className={'selection-none'}
                style={{
                  pointerEvents: 'auto',
                  paddingLeft: 25,
                  paddingRight: 10,
                  paddingBlock: 10,
                  minWidth: '400px',
                  maxWidth: '500px',
                  minHeight: '100px',
                  backgroundColor: '#2c2929',
                  margin: '10px',
                  position: 'relative',
                  borderRadius: '10px',
                }}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              >
                <Box sx={{ position: 'absolute', height: '100%', py: 1.5, top: 0, left: 10 }}>
                  <Box
                    sx={{
                      backgroundColor: notificationTheme.color,
                      height: '100%',
                      width: '5px',
                      borderRadius: 8,
                    }}
                  />
                </Box>

                <Stack
                  sx={{ height: '100%', alignItems: 'center', gap: 2, pl: 1 }}
                  direction={'row'}
                >
                  {notificationTheme.icon}
                  <Stack>
                    <Typography sx={{ color: 'white' }} level={'h4'} fontWeight={'bold'}>
                      {notification.title ? notification.title : '알림'}
                    </Typography>
                    <Typography
                      sx={{ color: 'white', width: '100%' }}
                      level={'title-sm'}
                      fontWeight={500}
                    >
                      {notification.message}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  sx={{ position: 'absolute', top: 2, right: 3, color: 'white' }}
                  onClick={() => hideDesktopSnackBar(notification.idx)}
                >
                  <CloseRoundedIcon style={{ fontSize: 32 }} />
                </IconButton>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Stack>
  );
}

function getNotificationTheme(
  color:
    | OverridableStringUnion<ColorPaletteProp, SnackbarPropsColorOverrides>
    | 'loading'
    | undefined,
) {
  const notificationTheme = {
    color: 'white',
    icon: <CheckCircleOutlineRoundedIcon />,
  };

  switch (color) {
    case 'primary':
      notificationTheme.color = '#9ACD32';
      break;
    case 'success':
      notificationTheme.color = colors.success[500];
      notificationTheme.icon = (
        <CheckCircleOutlineRoundedIcon style={{ fontSize: '36px', color: colors.success[500] }} />
      );
      break;
    case 'warning':
      notificationTheme.color = colors.warning[500];
      notificationTheme.icon = (
        <WarningAmberRoundedIcon style={{ fontSize: '36px', color: colors.warning[500] }} />
      );
      break;
    case 'danger':
      notificationTheme.color = colors.error[500];
      notificationTheme.icon = (
        <ErrorOutlineOutlinedIcon style={{ fontSize: '36px', color: colors.error[500] }} />
      );
      break;
    case 'neutral':
      notificationTheme.color = '#778899';
      notificationTheme.icon = <InfoOutlinedIcon style={{ fontSize: '36px', color: '#778899' }} />;
      break;
    default:
      break;
  }

  return notificationTheme;
}
