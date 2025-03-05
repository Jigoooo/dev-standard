import LogoutIcon from '@mui/icons-material/Logout';

import { useLogout } from '@/entities/auth';
import { Button, Divider, FlexColumn, FlexRow } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';
import { menuActions, myProfileMenu, useMenuState } from '@/entities/menu';
import { AnimatePresence, motion } from 'framer-motion';

export function SidebarFooter() {
  const menuState = useMenuState();

  const navigate = useNavigate();
  const logout = useLogout();

  const goMyProfile = () => {
    menuActions.setSelectedMenu(myProfileMenu);
    navigate(Router.MY_PROFILE);
  };

  return (
    <FlexColumn
      style={{
        position: 'absolute',
        left: 0,
        bottom: 14,
        width: '100%',
        paddingInline: 8,
        gap: 12,
        height: 52,
      }}
    >
      <motion.div
        layout
        style={{
          width: '100%',
        }}
      >
        <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.34)', height: 1 }} />
      </motion.div>

      <FlexRow
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FlexRow
          style={{
            display: 'flex',
            // alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            width: '70%',
          }}
          onClick={goMyProfile}
        >
          <FlexRow
            as={motion.div}
            layout
            animate={{ fontSize: menuState.sidebarCollapsed ? '2rem' : '2.4rem' }}
          >
            <myProfileMenu.icon style={{ color: '#ffffff', fontSize: 'inherit' }} />
          </FlexRow>
          <AnimatePresence>
            {!menuState.sidebarCollapsed && (
              <FlexColumn
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '90%' }}
              >
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  김지우(Jeff)
                </span>
                <span style={{ fontSize: '0.8rem', color: '#eeeeee', lineHeight: 1.4 }}>
                  매니저
                </span>
              </FlexColumn>
            )}
          </AnimatePresence>
        </FlexRow>
        <AnimatePresence>
          {!menuState.sidebarCollapsed && (
            <FlexRow
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button onClick={logout} style={{ backgroundColor: 'transparent' }}>
                <LogoutIcon style={{ color: '#ffffff', fontSize: '1.4rem' }} />
              </Button>
            </FlexRow>
          )}
        </AnimatePresence>
      </FlexRow>
    </FlexColumn>
  );
}
