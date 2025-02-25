import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Router } from '@/entities/router';
import { openDialog } from '@/shared/components';
import { menus } from '@/entities/menu';
import { Button, ButtonStyle, Checkbox, FlexDiv } from '@/shared/ui';

export function SignIn() {
  const navigate = useNavigate();

  const [signInForm, setSignInForm] = useState({
    id: '',
    password: '',
    autoLogin: false,
  });
  const handleSignInForm = (key: string, value: string | boolean) => {
    setSignInForm((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const signIn = async () => {
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

  const [check, setCheck] = useState(false);

  const handleCheck = () => {
    setCheck(!check);
  };

  return (
    <FlexDiv
      style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f9f9f9' }}
    >
      <FlexDiv
        style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <FlexDiv
          style={{
            display: 'flex',
            width: 300,
            height: 300,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Checkbox checked={check} onClick={handleCheck} label={'test'} />
          <Button style={{ width: '100%' }} buttonStyle={ButtonStyle.SOLID} onClick={() => {}}>
            버튼
          </Button>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );
}
