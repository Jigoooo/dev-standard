import { useNavigate } from 'react-router-dom';

import TriphosLogo from '@/shared/assets/images/triphos_logo.png';

import { Router } from '@/entities/router';
import { dialogActions, DialogType } from '@/shared/components';
import { menus } from '@/entities/menu';
import { Button, Checkbox, FlexDiv, Form, Input } from '@/shared/ui';
import { useToggle } from '@/shared/hooks';
import { getFormValues } from '@/shared/lib';
import { localStorageKey } from '@/shared/constants';

const signInFields: Record<
  keyof {
    id: string;
    password: string;
  },
  string
> = {
  id: 'id',
  password: 'password',
};

export function SignIn() {
  const navigate = useNavigate();
  const saveId = localStorage.getItem(localStorageKey.ID) ?? '';

  const [saveIdChecked, toggleSaveIdChecked] = useToggle(!!saveId);

  const signIn = (formData: FormData) => {
    const { id, password } = getFormValues(formData, signInFields);

    if (!id) {
      return dialogActions.openDialog({
        color: DialogType.WARNING,
        contents: '아이디를 입력해 주세요.',
      });
    }

    if (!password) {
      return dialogActions.openDialog({
        color: DialogType.WARNING,
        contents: '비밀번호를 입력해 주세요.',
      });
    }

    console.log('id: ', id);
    console.log('password: ', password);

    if (saveIdChecked) {
      localStorage.setItem(localStorageKey.ID, id);
    } else {
      localStorage.removeItem(localStorageKey.ID);
    }

    navigate(`${Router.MAIN}/${menus[0].router}`, { viewTransition: true });
  };

  return (
    <FlexDiv style={{ width: '100vw', height: '100vh', backgroundColor: '#f8f8f8' }}>
      <FlexDiv style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 530,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.06)',
            padding: 60,
            gap: 30,
          }}
          action={signIn}
        >
          <FlexDiv
            className={'selection-none'}
            flexDirection={'column'}
            style={{
              height: 60,
            }}
          >
            <img src={TriphosLogo} alt={'로고'} />
          </FlexDiv>
          <FlexDiv
            flexDirection={'column'}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Input
              name={signInFields.id}
              defaultValue={saveId}
              style={{ width: '100%' }}
              placeholder={'아이디'}
            />
            <Input
              name={signInFields.password}
              style={{ width: '100%' }}
              type={'password'}
              placeholder={'비밀번호'}
            />
            <FlexDiv
              style={{
                width: '100%',
              }}
            >
              <Checkbox
                checked={saveIdChecked}
                onClick={toggleSaveIdChecked}
                label={'아이디 저장'}
              />
            </FlexDiv>
          </FlexDiv>
          <Button type={'submit'} style={{ width: '100%' }}>
            <span>로그인</span>
          </Button>
        </Form>
      </FlexDiv>
    </FlexDiv>
  );
}
