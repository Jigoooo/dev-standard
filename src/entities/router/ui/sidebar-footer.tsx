import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useLogout } from '@/entities/auth';
import { AnchorPicker, Button, Divider, FlexColumn, FlexRow, Typography } from '@/shared/ui';
import { useRouterMenuContext } from '@/entities/router';
import { useSidebarState } from '@/entities/router';
import { Router } from '@/shared/router';
import { useMeState } from '@/entities/member';

export function SidebarFooter() {
  const memberState = useMeState();
  const sidebarState = useSidebarState();
  const { myProfileMenu } = useRouterMenuContext();

  const navigate = useNavigate();
  const logout = useLogout();

  const goMyProfile = () => {
    navigate(Router.MY_PROFILE);
  };

  const [openFooterMenu, setOpenFooterMenu] = useState(false);

  if (myProfileMenu === undefined) {
    return null;
  }

  return (
    <FlexColumn
      style={{
        position: 'absolute',
        left: 0,
        bottom: '0.75rem',
        width: '100%',
        gap: '0.375rem',
        height: '3.25rem',
        paddingLeft: '0.25rem',
        paddingRight: '0.5rem',
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
        as={motion.div}
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={sidebarState.sidebarCollapsed ? () => setOpenFooterMenu(true) : undefined}
      >
        <FlexRow
          style={{
            flexGrow: 1,
            gap: '0.25rem',
            cursor: 'pointer',
            width: '70%',
            borderRadius: '0.5rem',
            paddingInline: '0.25rem',
            paddingBlock: '0.25rem',
          }}
          onClick={!sidebarState.sidebarCollapsed ? goMyProfile : undefined}
        >
          <AnchorPicker
            isOpen={openFooterMenu}
            setIsOpen={setOpenFooterMenu}
            placement={'top-end'}
            contents={
              <FlexColumn
                style={{
                  padding: '0.5rem',
                  width: '12.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenFooterMenu(false);
                }}
              >
                <motion.span
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.375rem',
                    fontWeight: 500,
                  }}
                  whileHover={{ backgroundColor: '#eeeeee' }}
                  transition={{ duration: 0.1 }}
                  onClick={goMyProfile}
                >
                  내 정보
                </motion.span>
                <motion.span
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.375rem',
                    fontWeight: 500,
                  }}
                  whileHover={{ backgroundColor: '#eeeeee' }}
                  transition={{ duration: 0.1 }}
                  onClick={logout}
                >
                  로그아웃
                </motion.span>
              </FlexColumn>
            }
          >
            <FlexRow
              as={motion.div}
              initial={{ fontSize: '2.4rem' }}
              animate={{ fontSize: sidebarState.sidebarCollapsed ? '2rem' : '2.4rem' }}
              exit={{ fontSize: '2.4rem' }}
            >
              {myProfileMenu.icon && <myProfileMenu.icon style={{ color: '#ffffff' }} />}
            </FlexRow>
          </AnchorPicker>
          <AnimatePresence initial={false}>
            {!sidebarState.sidebarCollapsed && (
              <FlexColumn
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '90%' }}
              >
                <Typography
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
                  {memberState.name}({memberState.id})
                </Typography>
                <Typography style={{ fontSize: '0.8rem', color: '#eeeeee', lineHeight: 1.4 }}>
                  {memberState.email}
                </Typography>
              </FlexColumn>
            )}
          </AnimatePresence>
        </FlexRow>
        <AnimatePresence initial={false}>
          {!sidebarState.sidebarCollapsed && (
            <Button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={logout}
              style={{ backgroundColor: '#1e232e', paddingInline: 6, paddingBlock: 14 }}
              whileHover={{ backgroundColor: '#666666' }}
              transition={{ duration: 0.1 }}
            >
              <LogoutIcon style={{ color: '#ffffff', fontSize: '1.4rem' }} />
            </Button>
          )}
        </AnimatePresence>
      </FlexRow>
    </FlexColumn>
  );
}
