import LogoutIcon from '@mui/icons-material/Logout';

import { useLogout } from '@/entities/auth';
import { AnchorPicker, Button, Divider, FlexColumn, FlexRow } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';
import { menuActions, myProfileMenu, useMenuState } from '@/entities/menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useToggle } from '@/shared/hooks';

export function SidebarFooter() {
  const menuState = useMenuState();

  const navigate = useNavigate();
  const logout = useLogout();

  const goMyProfile = () => {
    menuActions.setSelectedMenu(myProfileMenu);
    navigate(Router.MY_PROFILE);
  };

  const [openFooterMenu, toggleFooterMenu] = useToggle();

  return (
    <FlexColumn
      style={{
        position: 'absolute',
        left: 0,
        bottom: 14,
        width: '100%',
        gap: 12,
        height: 52,
        paddingInline: 4,
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
          as={motion.div}
          style={{
            display: 'flex',
            gap: 12,
            cursor: 'pointer',
            width: '70%',
            borderRadius: 8,
            paddingInline: 4,
            paddingBlock: 4,
          }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onClick={menuState.sidebarCollapsed ? toggleFooterMenu : goMyProfile}
        >
          <AnchorPicker
            open={openFooterMenu}
            onClose={toggleFooterMenu}
            position={'topRight'}
            contents={
              <div
                style={{ width: 100, height: 100, backgroundColor: 'red' }}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFooterMenu();
                }}
              ></div>
            }
          >
            <FlexRow
              as={motion.div}
              initial={{ fontSize: '2.4rem' }}
              animate={{ fontSize: menuState.sidebarCollapsed ? '2rem' : '2.4rem' }}
              exit={{ fontSize: '2.4rem' }}
            >
              <myProfileMenu.icon style={{ color: '#ffffff' }} />
            </FlexRow>
          </AnchorPicker>
          <AnimatePresence initial={false}>
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
        <AnimatePresence initial={false}>
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
