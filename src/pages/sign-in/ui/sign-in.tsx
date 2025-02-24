import { Box, Stack, Typography } from '@mui/joy';
import { useState } from 'react';
import { motion } from 'framer-motion';

import SignInBackground from '@/shared/assets/images/home-manager-login-background.png';
import FuturLogo from '@/shared/assets/images/futur_logo.svg?react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Checkbox, CustomedFormControl, OutlinedInput, SolidButton } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';
import { openDialog } from '@/shared/components';
import { sleep } from '@/shared/lib';
import { menus } from '@/entities/menu';

export function SignIn() {
  const navigate = useNavigate();

  const [signInForm, setSignInForm] = useState({
    id: '',
    password: '',
    autoLogin: false,
  });
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignInForm = (key: string, value: string | boolean) => {
    setSignInForm((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const signIn = async () => {
    setIsSignInLoading(true);
    await sleep(800);
    setIsSignInLoading(false);
    navigate(`${Router.MAIN}/${menus[0].router}`, { viewTransition: true });
  };

  const signInPress = () => {
    if (!signInForm.id) {
      return openDialog({
        color: 'warning',
        contents: '아이디를 입력해 주세요.',
      });
    }

    if (!signInForm.password) {
      return openDialog({
        color: 'warning',
        contents: '비밀번호를 입력해 주세요.',
      });
    }

    signIn();
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#ffffff' }}>
      <Stack
        sx={{
          position: 'relative',
          width: '40%',
          minWidth: 600,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          px: 12,
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: 0.4,
          }}
        >
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000' }}>
            Home Manager
          </Typography>
        </Box>
        <Stack sx={{ gap: 2, width: '100%' }}>
          <CustomedFormControl label={'아이디'}>
            <OutlinedInput
              sx={{ width: '100%' }}
              value={signInForm.id}
              onChange={(event) => handleSignInForm('id', event.target.value)}
            />
          </CustomedFormControl>
          <CustomedFormControl label={'비밀번호'}>
            <OutlinedInput
              sx={{ width: '100%' }}
              type={passwordVisible ? 'text' : 'password'}
              value={signInForm.password}
              onChange={(event) => handleSignInForm('password', event.target.value)}
              endDecorator={
                <Box
                  component={motion.div}
                  key={passwordVisible ? 'visible' : 'hidden'}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.5 }}
                  sx={{ display: 'flex', cursor: 'pointer' }}
                  onTap={() => setPasswordVisible((prevState) => !prevState)}
                >
                  {passwordVisible ? (
                    <Visibility sx={{ fontSize: '1.4rem' }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: '1.4rem' }} />
                  )}
                </Box>
              }
            />
          </CustomedFormControl>
          <Box>
            <Checkbox
              label={'자동로그인'}
              checked={signInForm.autoLogin}
              onClick={() => handleSignInForm('autoLogin', !signInForm.autoLogin)}
            />
          </Box>
        </Stack>
        <Stack sx={{ gap: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <SolidButton
            loading={isSignInLoading}
            sx={{ minHeight: 0, height: 46, fontSize: '1rem', width: '100%' }}
            onClick={signInPress}
          >
            로그인
          </SolidButton>
          {/*<Typography sx={{ fontSize: '0.8rem' }}>*/}
          {/*  아직 PT 관리자 웹의 회원이 아니신가요?&nbsp;&nbsp;<Link>가입신청하기</Link>*/}
          {/*</Typography>*/}
        </Stack>

        <Box
          sx={{ position: 'absolute', bottom: 30, display: 'flex', alignItems: 'center', gap: 0.4 }}
        >
          <Typography sx={{ fontSize: '0.8rem' }}>ⓒ 2025.</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>
            <FuturLogo width={12} height={12} />
          </Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>Futur. All rights reserved.</Typography>
        </Box>
      </Stack>
      <Stack
        sx={{
          flexGrow: 1,
          minWidth: 1100,
          height: '100%',
          backgroundColor: '#f1f1f1',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component='img'
          src={SignInBackground}
          alt='Sign In Background'
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Stack>
    </Box>
  );
}
