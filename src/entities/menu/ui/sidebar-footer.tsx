import LogoutIcon from '@mui/icons-material/Logout';

import { useLogout } from '@/entities/auth';
import { Button, Divider, FlexColumn, FlexRow } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';
import { menuActions, myProfileMenu, useMenuState } from '@/entities/menu';

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
        paddingInline: 6,
        gap: 12,
      }}
    >
      <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.34)' }} />
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
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            width: '70%',
          }}
          onClick={goMyProfile}
        >
          <myProfileMenu.icon style={{ color: '#ffffff', fontSize: '2.4rem', flexShrink: 0 }} />
          {!menuState.sidebarCollapsed && (
            <FlexColumn style={{ width: '90%' }}>
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
              <span style={{ fontSize: '0.8rem', color: '#eeeeee', lineHeight: 1.4 }}>매니저</span>
            </FlexColumn>
          )}
        </FlexRow>
        {!menuState.sidebarCollapsed && (
          <Button onClick={logout} style={{ backgroundColor: 'transparent' }}>
            <LogoutIcon style={{ color: '#ffffff', fontSize: '1.4rem' }} />
          </Button>
        )}
      </FlexRow>
    </FlexColumn>
  );
}
