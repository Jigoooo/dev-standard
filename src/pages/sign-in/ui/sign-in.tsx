import { useNavigate } from 'react-router-dom';

import { Router } from '@/entities/router';
import { dialogActions, DialogType } from '@/shared/components';
import { menus } from '@/entities/menu';
import { Button, Checkbox, FlexDiv, Form, Input } from '@/shared/ui';
import { useToggle } from '@/shared/hooks';
import { getFormValues } from '@/shared/lib';

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

  const [autoLogin, toggleAutoLogin] = useToggle(false);

  const signIn = async ({ id, password }: { id: string; password: string }) => {
    console.log('id: ', id);
    console.log('password: ', password);
    navigate(`${Router.MAIN}/${menus[0].router}`, { viewTransition: true });
  };

  const handleSubmit = (formData: FormData) => {
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

    signIn({ id, password });
  };

  return (
    <FlexDiv style={{ width: '100vw', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <FlexDiv style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 500,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.06)',
            padding: 60,
            gap: 26,
          }}
          handleSubmit={handleSubmit}
        >
          <FlexDiv
            flexDirection={'column'}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <Input name={signInFields.id} style={{ width: '100%' }} />
            <Input name={signInFields.password} style={{ width: '100%' }} type={'password'} />
            <FlexDiv
              style={{
                width: '100%',
              }}
            >
              <Checkbox checked={autoLogin} onClick={toggleAutoLogin} label={'아이디 저장'} />
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
